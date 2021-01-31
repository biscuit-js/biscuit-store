import {
    createStore,
    dispatch,
    subscribeToState,
    subscribeToStore,
} from '../index';

const testStore = (value) => {
    return createStore({
        repo: {
            name: 'test-' + value,
            initial: { data: '' },
        },
        states: {
            testStart: 'TEST/START',
            testStep: 'TEST/STEP',
            testStop: 'TEST/STOP',
        },
        strictMode: false,
    });
};

it('check state.dispatch -> state.subscribe', (done) => {
    expect.assertions(1);
    const target = testStore(0);
    const { testStart } = target.actions;

    testStart.subscribe((state) => {
        expect(state.data).toEqual('test-0');
        done();
    });

    testStart.dispatch({ data: 'test-0' });
});

it('check callback state.dispatch -> state.subscribe', (done) => {
    expect.assertions(1);
    const target = testStore(1);
    const { testStart } = target.actions;

    testStart.subscribe((state) => {
        expect(state.data).toEqual('test-1');
        done();
    });

    testStart.dispatch((prev) => ({ data: prev.data + 'test-1' }));
});

it('check callback state.dispatch -> async state.subscribe', (done) => {
    expect.assertions(1);
    const target = testStore('async-state-s');
    const { testStart } = target.actions;

    testStart.subscribe().then((repo) => {
        expect(repo.data).toEqual('test-1');
        done();
    });

    testStart.dispatch((prev) => ({ data: prev.data + 'test-1' }));
});

it('check store.dispatch -> store.subscribe', (done) => {
    expect.assertions(1);
    const target = testStore(2);
    const { testStep } = target.actions;

    target.store.subscribe((repo) => {
        expect(repo.data).toEqual('test-2');
        done();
    });

    testStep.dispatch({ data: 'test-2' });
});

it('check store.dispatch -> async store.subscribe', (done) => {
    expect.assertions(1);
    const target = testStore('async-store-s');
    const { testStep } = target.actions;

    target.store.subscribe().then((repo) => {
        expect(repo.data).toEqual('test-2');
        done();
    });

    testStep.dispatch({ data: 'test-2' });
});

it('check state.dispatch.before -> state.subscribe', () => {
    expect.assertions(1);
    const target = testStore(3);
    const { testStep } = target.actions;

    testStep.dispatch({ data: 'test-3' }).before((state) => {
        expect(state.data).toEqual('');
    });
});

it('check state.dispatch.after -> state.subscribe', (done) => {
    expect.assertions(1);
    const target = testStore(4);
    const { testStep } = target.actions;

    testStep.dispatch({ data: 'test-4' }).after((state) => {
        expect(state.data).toEqual('test-4');
        done();
    });
});

it('check dispatch -> subscribeToState', (done) => {
    expect.assertions(1);
    const target = testStore(5);
    const { testStep } = target.actions;

    subscribeToState(testStep, (state) => {
        expect(state.data).toEqual('test-5');
        done();
    });

    dispatch(testStep, { data: 'test-5' });
});

it('check unsubscriber', (done) => {
    expect.assertions(0);
    const target = testStore('unsubscriber');
    const { testStep } = target.actions;

    const task = subscribeToState(testStep, (state) => {
        expect(state.data).toEqual('test-6');
    });
    console.log(task);
    task.unsubscribe();

    dispatch(testStep, { data: 'test-6' }).after(() => {
        done();
    });
});

it('check callback dispatch -> subscribeToStore', (done) => {
    expect.assertions(1);
    const target = testStore(6);
    const { testStep } = target.actions;

    subscribeToStore(target.store.repo, (state) => {
        expect(state.data).toEqual('test-6');
        done();
    });

    dispatch(testStep, () => ({ data: 'test-6' }));
});

it('check dispatch.before', (done) => {
    expect.assertions(1);
    const target = testStore(7);
    const { testStep } = target.actions;

    dispatch(testStep, { data: 'test-7' }).before((state) => {
        expect(state.data).toEqual('');
        done();
    });
});

it('check dispatch.after', (done) => {
    expect.assertions(1);
    const target = testStore(8);
    const { testStep } = target.actions;

    dispatch(testStep, { data: 'test-8' }).after((state) => {
        expect(state.data).toEqual('test-8');
        done();
    });
});

it('dispatch not action', () => {
    const err = 'Invalid action parameters.';
    expect(() => {
        dispatch(null, { data: 'test-8' });
    }).toThrowError(new Error(err));

    expect(() => {
        dispatch({ repo: 'test' }, { data: 'test-8' });
    }).toThrowError(new Error(err));

    expect(() => {
        dispatch({ state: 'TEST/START' }, { data: 'test-8' });
    }).toThrowError(new Error(err));
});

it('dispatch invalid payload type', () => {
    const err = 'The payload must be an object or function.';
    const target = testStore(9);
    const { testStep } = target.actions;
    expect(() => {
        dispatch(testStep, null);
    }).toThrowError(new Error(err));
    expect(() => {
        dispatch(testStep, []);
    }).toThrowError(new Error(err));
});

it('dispatch repo not found', () => {
    expect(() => {
        dispatch({ repo: 'error', state: 'name' }, {});
    }).toThrowError(new Error('repository <error> not found.'));
});

it('dispatch state not found', () => {
    const target = testStore(10);
    expect(() => {
        dispatch({ repo: target.store.repo, state: 'error' }, {});
    }).toThrowError(new Error('state <error> not found.'));
});

it('subscribeToStore repo not found', (done) => {
    expect.assertions(1);
    subscribeToStore('errorTest', () => undefined).catch((e) => {
        expect(e.message).toEqual('repository <errorTest> not found.');
        done();
    });
});

it('subscribeToState repo not found', (done) => {
    expect.assertions(1);
    subscribeToState({ repo: 'sdsd', state: 'test' }, () => undefined).catch(
        (e) => {
            expect(e.message).toEqual('repository <sdsd> not found.');
            done();
        }
    );
});

it('subscribeToState state not found', (done) => {
    expect.assertions(1);
    const target = testStore(11);
    subscribeToState(
        { repo: target.store.repo, state: 'testError' },
        () => undefined
    ).catch((e) => {
        expect(e.message).toEqual('state <testError> not found.');
        done();
    });
});

it('subscribeToState invalid action type', (done) => {
    expect.assertions(1);
    subscribeToState(null, () => undefined).catch((e) => {
        expect(e.message).toEqual('Invalid action parameters.');
        done();
    });
});