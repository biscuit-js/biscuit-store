
import { initialActions, createStore, createActionTo } from '../src/index';

const testStore = (name) => {
	return createStore({
		name: 'test-' + name,
		initial: { data: '' },
		actions: {
			testStart: 'TEST/START',
			testStep: 'TEST/STEP',
			testStop: 'TEST/STOP',
		},
		strictMode: false,
	});
};

it('initialActions test', () => {
	const { store } = testStore('134');

	const [test1, test2] = initialActions(createActionTo(store), [
		'action/test1',
		'action/test2',
	]);

	expect(typeof test1.dispatch).toEqual('function');
	expect(typeof test1.getState).toEqual('function');
	expect(typeof test1.subscribe).toEqual('function');
	expect(test1.type).toEqual('action/test1');
	expect(test1.name).toEqual('test-134');

	expect(typeof test2.dispatch).toEqual('function');
	expect(typeof test2.getState).toEqual('function');
	expect(typeof test2.subscribe).toEqual('function');
	expect(test2.type).toEqual('action/test2');
	expect(test2.name).toEqual('test-134');
});