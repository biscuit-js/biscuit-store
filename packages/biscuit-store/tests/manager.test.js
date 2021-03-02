import { createStore, createManager } from '../src/index.js';


const testStore = (value) => {
    return createStore({
        name: 'test-' + value,
        initial: { data: 123 },
        actions: {
            testStart: 'TEST/START',
            testBranch: {
                name: 'TEST/BRANCH',
                branch: true,
                initial: { value: 0 },
            },
            testBranch2: {
                name: 'TEST/BRANCH2',
                branch: true,
                initial: { value: 0 },
            },
            testBranch3: {
                name: 'TEST/BRANCH3',
                branch: true,
                initial: { value: 3 },
            },
            testBranch4: {
                name: 'TEST/BRANCH4',
                branch: true,
                initial: { data: 123 },
            },
            testBranch5: {
                name: 'TEST/BRANCH5',
                branch: true,
                initial: { fun: () => 123 },
            },
            testBranch6: {
                name: 'TEST/BRANCH6',
                branch: true,
                initial: { fun: () => 123 },
            },
        },
    });
};

it('create manager test', () => {
    const { actions } = testStore(1);
    const manager = createManager(actions.testBranch);
    expect(typeof manager.merge).toBe('function');
    expect(typeof manager.pull).toBe('function');
    expect(typeof manager.replaceStore).toBe('function');
    expect(typeof manager.replaceState).toBe('function');
    expect(typeof manager.compareStates).toBe('function');
    expect(typeof manager.compareWithState).toBe('function');
    expect(typeof manager.compareStateWithInstance).toBe('function');
    expect(typeof manager.compareStoreWithInstance).toBe('function');
    expect(typeof manager.update).toBe('function');
    expect(manager.props === actions.testBranch).toBe(true);
});

it('manager test compareStates', () => {
    const { actions } = testStore(2);
    const manager1 = createManager(actions.testBranch);
    expect(manager1.compareStates(actions.testBranch2)).toBe(true);
    expect(manager1.compareStates(actions.testBranch3)).toBe(false);
    expect(
        createManager(actions.testBranch5)
            .compareStates(actions.testBranch6)
    ).toBe(true);
});

it('manager test compareWithState', () => {
    const { actions } = testStore(3);
    const manager1 = createManager(actions.testBranch4);
    expect(manager1.compareWithState()).toBe(true);
    const manager2 = createManager(actions.testBranch3);
    expect(manager2.compareWithState()).toBe(false);
});