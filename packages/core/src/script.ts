import {
    createStore,
    subscribeToState,
    subscribeToStore,
    dispatch,
    getState,
    getRepo,
    addRepo,
    createStateTo,
    initialActions,
    stateCollection,
    combineStateCollections,
    middleware,
    createDebuger,
    manager,
} from './';

interface Initial {
    value: number;
}


interface NewInitial {
    id: number;
}

const { store, actions } = createStore({
    repo: {
        name: 'user',
        initial: { value: 0 },
    },
    states: {
        testAdd: 'TEST/ADD',
        testRemove: 'TEST/REMOVE',
        testStep: {
            name: 'TEST/STEP',
            branch: true,
            initial: { name: 'fill' },
        },
    },
});

middleware(actions.testAdd).add((context, next) => {
    console.log('context', context);
    next();
});

createDebuger(store, (e) => {
    console.log(e);
});

store.subscribe<Initial>((state: Initial) => {
    console.log(state);
});

subscribeToState<Initial>(actions.testAdd, (state: Initial) => {
    console.log(state);
});

subscribeToStore<Initial>('user', (state: Initial) => {
    console.log(state);
});

actions.testAdd.subscribe<Initial>((state: Initial) => {
    console.log(state);
});

actions.testAdd.dispatch({ value: 12 }).after<Initial>((state: Initial) => {
    console.log(state);
});

dispatch(actions.testAdd, { value: 2 }).before<Initial>((state: Initial) => {
    console.log(state);
});

dispatch(actions.testAdd, (prev: Initial) => ({ value: prev.value += 999 }));

console.log(actions.testAdd.getState<Initial>().value);

console.log(getState<Initial>(actions.testAdd).value);

console.log(getRepo<Initial>('user').value);

addRepo<NewInitial>('user', { id: 2 });

const superAction = createStateTo(store).bind('SUPER/ACTION');

console.log(superAction);

const actionCollection = initialActions(createStateTo(store), [
    { name: 'FIRST/ACTION', options: { branch: true, initial: { name: 'fil' } } },
    'TWO/ACTION',
    'LAST/ACTION',
]);

console.log(actionCollection);

const collection = stateCollection();
collection.compile(actions.testAdd, actions.testRemove);

console.log(collection.all());
console.log(collection.fromRepo('user'));
console.log(collection.outOfState('TEST/ADD'));

const collection1 = stateCollection();
collection1.compile(actions.testStep);

const combineCollection = combineStateCollections(collection, collection1);
console.log('sss', combineCollection.all());


manager(actions.testStep).merge();
console.log(
    'compare instance',
    manager(actions.testStep)
        .compareRepoWithInstance({ value: 0, id: 2, name: 'fill' })
);

console.log('1111111', getRepo('user'));

addRepo('user', { result: 999 });
console.log('not pull', getState(actions.testStep));
manager(actions.testStep).pull();
console.log('pull', getState(actions.testStep));

// manager(actions.testStep).remove();

manager(actions.testStep).clone('cloneuser');

console.log('get clone', getRepo('cloneuser'));