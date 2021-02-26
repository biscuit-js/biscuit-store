import { createStore } from '../src/index.js';

const testStart = 'TEST/START';

const states = {
    testStart,
    testStep: 'TEST/STEP',
    testStop: 'TEST/STOP',
};

it('check new store', () => {
    const testStore = createStore({
        repo: {
            name: 'test-1',
            initial: { data: 'test' },
        },
    });

    expect(testStore.store.repo).toEqual('test-1');
});

it('check new store methods', () => {
    const testStore = createStore({
        repo: {
            name: 'test-2',
            initial: { data: 'test' },
        },
    });

    expect(testStore.store.get).not.toBeUndefined();
    expect(testStore.store.add).not.toBeUndefined();
    expect(testStore.store.subscribe).not.toBeUndefined();

    expect(testStore.store.get).not.toBeNull();
    expect(testStore.store.add).not.toBeNull();
    expect(testStore.store.subscribe).not.toBeNull();
});

it('check new store initial', () => {
    const testStore = createStore({
        repo: {
            name: 'test-3',
            initial: { data: 'test' },
        },
    });

    expect(testStore.store.get()).toEqual({ data: 'test' });
});

it('check store action instance', () => {
    const testStore = createStore({
        repo: {
            name: 'test-4',
            initial: { data: 'test' },
        },
        states,
    });

    expect(testStore.actions.testStart).not.toBeUndefined();
    expect(testStore.actions.testStep).not.toBeUndefined();
    expect(testStore.actions.testStop).not.toBeUndefined();

    expect(testStore.actions.testStart).not.toBeNull();
    expect(testStore.actions.testStep).not.toBeNull();
    expect(testStore.actions.testStop).not.toBeNull();
});

it('check store action functions', () => {
    const testStore = createStore({
        repo: {
            name: 'test-5',
            initial: { data: 'test' },
        },
        states,
    });

    expect(testStore.actions.testStart).not.toBeUndefined();
    expect(testStore.actions.testStep).not.toBeUndefined();
    expect(testStore.actions.testStop).not.toBeUndefined();

    expect(testStore.actions.testStart).not.toBeNull();
    expect(testStore.actions.testStep).not.toBeNull();
    expect(testStore.actions.testStop).not.toBeNull();
});

it('check store action functions', () => {
    const testStore = createStore({
        repo: {
            name: 'test-6',
            initial: { data: 'test' },
        },
        states,
    });

    expect(testStore.actions.testStart.repo).not.toBeUndefined();
    expect(testStore.actions.testStart.state).not.toBeUndefined();
    expect(testStore.actions.testStart.subscribe).not.toBeUndefined();
    expect(testStore.actions.testStart.dispatch).not.toBeUndefined();
    expect(testStore.actions.testStart.getState).not.toBeUndefined();

    expect(testStore.actions.testStart.repo).not.toBeNull();
    expect(testStore.actions.testStart.state).not.toBeNull();
    expect(testStore.actions.testStart.subscribe).not.toBeNull();
    expect(testStore.actions.testStart.dispatch).not.toBeNull();
    expect(testStore.actions.testStart.getState).not.toBeNull();
});

it('check store repo and state', () => {
    const testStore = createStore({
        repo: {
            name: 'test-7',
            initial: { data: 'test' },
        },
        states,
    });

    expect(testStore.actions.testStart.repo).toEqual('test-7');
    expect(testStore.actions.testStart.state).toEqual(testStart);
});

it('check store change repo', () => {
    const testStore = createStore({
        repo: {
            name: 'test-8',
            initial: { data: 'test' },
        },
        states,
    });

    expect(testStore.actions.testStart.getState()).toEqual({ data: 'test' });
    expect(testStore.store.get()).toEqual({ data: 'test' });

    testStore.store.add({ data: 'test-1' });

    expect(testStore.actions.testStart.getState()).toEqual({ data: 'test-1' });
    expect(testStore.store.get()).toEqual({ data: 'test-1' });
});

it('check store change state', (done) => {
    expect.assertions(4);
    const testStore = createStore({
        repo: {
            name: 'test-9',
            initial: { data: 'test' },
        },
        states,
    });

    expect(testStore.actions.testStart.getState()).toEqual({ data: 'test' });
    expect(testStore.store.get()).toEqual({ data: 'test' });

    testStore.actions.testStart.dispatch({ data: 'test-1' }).after(() => {
        expect(testStore.actions.testStart.getState()).toEqual({
            data: 'test-1',
        });
        expect(testStore.store.get()).toEqual({ data: 'test-1' });
        done();
    });
});

it('check store branch state', (done) => {
    expect.assertions(4);
    const testStore = createStore({
        repo: {
            name: 'test-10',
            initial: { data: 'test' },
        },
        actions: {
            testStart: {
                name: testStart,
                initial: { id: 0, data: 'test-1' },
                branch: true,
            },
        },
    });

    expect(testStore.store.get()).toEqual({ data: 'test' });
    expect(testStore.actions.testStart.getState()).toEqual({
        data: 'test-1',
        id: 0,
    });

    testStore.actions.testStart
        .dispatch({ data: 'test-2', id: 2 })
        .after(() => {
            expect(testStore.actions.testStart.getState()).toEqual({
                data: 'test-2',
                id: 2,
            });
            expect(testStore.store.get()).toEqual({ data: 'test' });
            done();
        });
});

it('check store middleware', (done) => {
    expect.assertions(6);
    const testStore = createStore({
        repo: {
            name: 'test-11',
            initial: { data: 'test' },
        },
        states,
        strictMode: false,
        middleware: [
            (context, next) => {
                expect(context.action).toEqual(testStart);
                expect(context.payload).toEqual({ data: 'test-2', id: 2 });
                expect(context.repo).toEqual('test-11');
                expect(context.state).toEqual({ data: 'test' });
                expect(context.getAction(testStart).state).toEqual(testStart);
                expect(typeof next).toEqual('function');
                next();

                done();
            },
        ],
    });

    testStore.actions.testStart.dispatch({ data: 'test-2', id: 2 });
});

it('check store debugger', (done) => {
    expect.assertions(7);
    const testStore = createStore({
        repo: {
            name: 'test-12',
            initial: { data: 'test' },
        },
        states,
        strictMode: false,
        debugger: (e) => {
            if (e.type === 'log') {
                expect(e.message).toEqual(
                    'Biscuit log: dispatch -> store: test-12, state: TEST/START'
                );
            }

            if (e.type === 'warning') {
                expect(e.message).toEqual(
                    'Biscuit warn: store "test-12" has no active subscriptions.'
                );
                done();
            }

            if (
                e.type === 'error' &&
				e.level === 'local' &&
				e.repo === 'test-12'
            ) {
                expect(e).not.toBeUndefined();
                expect(e).not.toBeNull();
                expect(typeof e).toEqual('object');
                expect(e.message).toEqual(
                    'Biscuit error: The payload must be an object or function.'
                );
            }
        },
    });

    testStore.actions.testStart.dispatch({ data: 'test-2', id: 2 });
    expect(() => {
        testStore.actions.testStart.dispatch(null);
    }).toThrow();
});

it('check store no params', () => {
    expect(() => {
        createStore();
    }).toThrowError(
        new Error('The createStore method must contain the storage parameters.')
    );
});

it('check store no repo name', () => {
    expect(() => {
        createStore({
            repo: {
                initial: {},
            },
        });
    }).toThrowError(new Error('The repository name is a required field.'));
});

it('check store invalid initial type', () => {
    expect(() => {
        createStore({
            repo: {
                name: 'test-13',
                initial: null,
            },
        });
    }).toThrowError(new Error('The initial must be an object.'));
});

it('check store invalid state type', () => {
    expect(() => {
        createStore({
            repo: {
                name: 'test-14',
                initial: {},
            },
            actions: {
                testState: 1,
            },
        });
    }).toThrowError(new Error('The state name must be a string.'));
});

it('check store invalid middleware type', () => {
    expect(() => {
        createStore({
            repo: {
                name: 'test-15',
                initial: {},
            },
            states,
            middleware: [null],
        });
    }).toThrowError(new Error('Middleware should be provided as a feature.'));
});

it('check store invalid middleware type', () => {
    expect(() => {
        createStore({
            repo: {
                name: 'test-16',
                initial: {},
            },
            states,
            debugger: [],
        });
    }).toThrowError(new Error('Debugger should be provided as a feature.'));
});