import { createStore, container } from '../src/index.js';

it('container test', () => {
	const { actions } = createStore({
		name: 'test1',
		initial: { value: 1 },
		actions: {
			start: 'start/action',
			step: 'step/action',
		},
		strictMode: false,
	});

	container.include(actions);

	const { start, step } = container.extract('test1');

	expect(typeof start.dispatch).toEqual('function');
	expect(typeof step.dispatch).toEqual('function');
});