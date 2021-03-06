
import { stateCollection, createStore } from '../src/index';

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

it('stateCollection create test', () => {
	const collection = stateCollection();

	expect(typeof collection.all).toEqual('function');
	expect(typeof collection.compile).toEqual('function');
	expect(typeof collection.fromStore).toEqual('function');
	expect(typeof collection.outOfState).toEqual('function');
});

it('stateCollection all test', () => {
	const { actions } = testStore('1234');

	const collection = stateCollection();

	collection.compile(actions.testStart, actions.testStep, actions.testStop);
	expect(collection.all()['test-1234'].length).toEqual(3);
});

it('stateCollection multy test', () => {
	const a = testStore(1);
	const b = testStore(2);

	const collection = stateCollection();

	collection.compile(
		a.actions.testStart,
		b.actions.testStep,
		b.actions.testStop
	);
	expect(collection.all()['test-1'].length).toEqual(1);
	expect(collection.all()['test-2'].length).toEqual(2);
});

it('stateCollection fromStore test', () => {
	const a = testStore(10);
	const b = testStore(11);

	const collection = stateCollection();

	collection.compile(
		a.actions.testStart,
		a.actions.testStep,
		b.actions.testStop
	);

	expect(collection.fromStore('test-10').length).toEqual(2);
	expect(collection.fromStore('test-11').length).toEqual(1);
});

it('stateCollection outOfState test', () => {
	const a = testStore(12);
	const b = testStore(13);

	const collection = stateCollection();

	collection.compile(
		a.actions.testStart,
		a.actions.testStep,
		b.actions.testStop
	);
	const target = collection.outOfState('TEST/STEP');
	expect(target[0].type).toEqual('TEST/STEP');
	expect(target[0].name).toEqual('test-12');
});