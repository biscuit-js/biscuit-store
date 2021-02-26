import { createStore, createActionTo } from '../src/index.js';

it('createActionTo', () => {
    const name = 'test-din-action';
    const { store } = createStore({
        repo: {
            name,
            initial: { value: 1 },
        },
        actions: {
            testStart: 'test/start',
        },
        strictMode: false,
    });

    const states = createActionTo(store);
    const action = states.bind('test/step1');

    expect(action.repo).toEqual(name);
    expect(action.state).toEqual('test/step1');
    expect(typeof action.dispatch).toEqual('function');
    expect(typeof action.subscribe).toEqual('function');
    expect(typeof action.getState).toEqual('function');
});