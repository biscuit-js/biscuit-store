export {
    createStore,
    newRepo,
    createStateTo,
    initialActions,
    stateCollection,
    combineStateCollections,
    middleware,
    createDebuger,
} from './internal/creator';

export {
    manager,
    dispatch,
    getRepo,
    getState,
    addRepo,
    subscribeToState,
    subscribeToStore,
} from './internal/store';
