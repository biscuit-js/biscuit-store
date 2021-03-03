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
			testBranch7: {
				name: 'TEST/BRANCH7',
				branch: true,
				initial: { obj: { value: 1 } },
			},
			testBranch8: {
				name: 'TEST/BRANCH8',
				branch: true,
				initial: { obj: { value: 1 } },
			},
			testBranch9: {
				name: 'TEST/BRANCH9',
				branch: true,
				initial: { data: 222, value: 333 },
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
		createManager(actions.testBranch5).compareStates(actions.testBranch6)
	).toBe(true);

	expect(
		createManager(actions.testBranch7).compareStates(actions.testBranch8)
	).toBe(true);

	expect(
		createManager(actions.testBranch3).compareStates(actions.testBranch8)
	).toBe(false);
});

it('manager test compareWithState', () => {
	const { actions } = testStore(3);
	const manager1 = createManager(actions.testBranch4);
	expect(manager1.compareWithState()).toBe(true);
	const manager2 = createManager(actions.testBranch3);
	expect(manager2.compareWithState()).toBe(false);
});

it('manager test compareStateWithInstance', () => {
	const { actions } = testStore(4);
	const manager = createManager(actions.testBranch3);
	expect(manager.compareStateWithInstance({ data: 123, value: 3 })).toBe(
		true
	);
	expect(manager.compareStateWithInstance({ data: 1, value: 3 })).toBe(false);
	expect(manager.compareStateWithInstance({ value: 3 })).toBe(false);
});

it('manager test compareStoreWithInstance', () => {
	const { actions } = testStore(5);
	const manager = createManager(actions.testBranch3);
	expect(manager.compareStoreWithInstance({ data: 123 })).toBe(true);
	expect(manager.compareStoreWithInstance({ data: 2 })).toBe(false);
	expect(manager.compareStoreWithInstance({ data: 123, value: 3 })).toBe(
		false
	);
});

it('manager test merge', () => {
	const { actions, store } = testStore(6);
	const manager = createManager(actions.testBranch9);
	expect(store.get()).toEqual({ data: 123 });
	expect(actions.testBranch9.getState()).toEqual({ data: 222, value: 333 });
	manager.merge();
	expect(store.get()).toEqual({ data: 222, value: 333 });
});

it('manager test pull', () => {
	const { actions, store } = testStore(7);
	const manager = createManager(actions.testBranch9);
	expect(store.get()).toEqual({ data: 123 });
	expect(actions.testBranch9.getState()).toEqual({ data: 222, value: 333 });
	manager.pull();
	expect(actions.testBranch9.getState()).toEqual({ data: 123, value: 333 });
});

it('manager test pull', () => {
	const { actions, store } = testStore(7);
	const manager = createManager(actions.testBranch9);
	expect(store.get()).toEqual({ data: 123 });
	expect(actions.testBranch9.getState()).toEqual({ data: 222, value: 333 });
	manager.pull();
	expect(actions.testBranch9.getState()).toEqual({ data: 123, value: 333 });
});

it('manager test replaceStore', () => {
	const { actions, store } = testStore(8);
	const manager = createManager(actions.testBranch9);
	expect(store.get()).toEqual({ data: 123 });
	expect(actions.testBranch9.getState()).toEqual({ data: 222, value: 333 });
	manager.replaceStore();
	expect(store.get()).toEqual({ data: 222, value: 333 });
});
it('manager test replaceStore', () => {
	const { actions, store } = testStore(9);
	const manager = createManager(actions.testBranch9);
	expect(store.get()).toEqual({ data: 123 });
	expect(actions.testBranch9.getState()).toEqual({ data: 222, value: 333 });
	manager.replaceState();
	expect(actions.testBranch9.getState()).toEqual({ data: 123 });
});

it('manager test update', (done) => {
	expect.assertions(1);
	const { actions } = testStore(9);
	const manager = createManager(actions.testBranch9);

	actions.testBranch9.subscribe((current) => {
		expect(current).toEqual({ data: 222, value: 333 });
		done();
	});

	manager.update();
});