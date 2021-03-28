import { createStore } from '../src/index.js';

it('initialCall async test', () => {
	async function Test() {
		return await new Promise((resolve) => {
			resolve({ data: 10 });
		});
	}

	const { store } = createStore({
		name: 'test1',
		initial: { data: 0 },
		actions: {
			start: 'start/action',
		},
		initialCall: Test,
	});

	setTimeout(() => {
		expect(store.get().data).toEqual(10);
	}, 500);
});

it('initialCall test', () => {
	function Test() {
		return { data: 100 };
	}

	const { store } = createStore({
		name: 'test2',
		initial: { data: 0 },
		actions: {
			start: 'start/action',
		},
		initialCall: Test,
	});

	setTimeout(() => {
		expect(store.get().data).toEqual(100);
	}, 500);
});