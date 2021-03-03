import {
	createStore,
	dispatch,
	subscribeToState,
	subscribeToStore,
} from '../src/index';

const testStore = (name, value) => {
	return createStore({
		name: 'test-' + name,
		initial: { data: '', value },
		actions: {
			testStart: 'TEST/START',
			testStep: 'TEST/STEP',
			testStop: 'TEST/STOP',
		},
		strictMode: false,
	});
};

it('check action.dispatch -> action.subscribe', (done) => {
	expect.assertions(1);
	const target = testStore(0);
	const { testStart } = target.actions;

	testStart.subscribe((state) => {
		expect(state.data).toEqual('test-0');
		done();
	});

	testStart.dispatch({ data: 'test-0' });
});

it('check callback action.dispatch -> action.subscribe', (done) => {
	expect.assertions(1);
	const target = testStore(1);
	const { testStart } = target.actions;

	testStart.subscribe((state) => {
		expect(state.data).toEqual('test-1');
		done();
	});

	testStart.dispatch((prev) => ({ data: prev.data + 'test-1' }));
});

it('check callback action.dispatch -> async action.subscribe', (done) => {
	expect.assertions(1);
	const target = testStore('async-state-s');
	const { testStart } = target.actions;

	testStart.subscribe().then((store) => {
		expect(store.data).toEqual({ data: 'test-1' });
		done();
	});

	testStart.dispatch((prev) => ({ data: prev.data + 'test-1' }));
});

it('check store.dispatch -> store.subscribe', (done) => {
	expect.assertions(1);
	const target = testStore(2);
	const { testStep } = target.actions;

	target.store.subscribe((store) => {
		expect(store.data).toEqual('test-2');
		done();
	});

	testStep.dispatch({ data: 'test-2' });
});

it('check store.dispatch -> async store.subscribe', (done) => {
	expect.assertions(1);
	const target = testStore('async-store-s');
	const { testStep } = target.actions;

	target.store.subscribe().then((store) => {
		expect(store.data).toEqual({ data: 'test-2' });
		done();
	});

	testStep.dispatch({ data: 'test-2' });
});

it('check action.dispatch.before -> action.subscribe', () => {
	expect.assertions(1);
	const target = testStore(3);
	const { testStep } = target.actions;

	testStep.dispatch({ data: 'test-3' }).before((state) => {
		expect(state.data).toEqual('');
	});
});

it('check action.dispatch.after -> action.subscribe', (done) => {
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

	task.unsubscribe();

	dispatch(testStep, { data: 'test-6' }).after(() => {
		done();
	});
});

it('check callback dispatch -> subscribeToStore', (done) => {
	expect.assertions(1);
	const target = testStore(6);
	const { testStep } = target.actions;

	subscribeToStore(target.store.name, (state) => {
		expect(state.data).toEqual('test-6');
		done();
	});

	dispatch(testStep, () => ({ data: 'test-6' }));
});

it('loop dispatch test', async (done) => {
	expect.assertions(5);
	const target = testStore('loop_test', 0);
	const { testStep } = target.actions;

	let i = 0;
	subscribeToStore(target.store.name, (state) => {
		i += 1;
		expect(state.value).toEqual(i);
		if (i === 5) {
			done();
		}
	});

	const values = new Array(5).fill(1);
	for (let value of values) {
		await dispatch(testStep, (prev) => ({ value: prev.value + value }))
			.wait;
	}
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
		dispatch({ name: 'test' }, { data: 'test-8' });
	}).toThrowError(new Error(err));

	expect(() => {
		dispatch({ type: 'TEST/START' }, { data: 'test-8' });
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

it('dispatch store not found', () => {
	expect(() => {
		dispatch({ name: 'error', type: 'name' }, {});
	}).toThrowError(new Error('store <error> not found.'));
});

it('dispatch state not found', () => {
	const target = testStore(10);
	expect(() => {
		dispatch({ name: target.store.name, type: 'error' }, {});
	}).toThrowError(new Error('state <error> not found.'));
});

it('subscribeToStore store not found', (done) => {
	expect.assertions(1);
	subscribeToStore('errorTest', () => undefined).catch((e) => {
		expect(e.message).toEqual('store <errorTest> not found.');
		done();
	});
});

it('subscribeToState store not found', (done) => {
	expect.assertions(1);
	subscribeToState({ name: 'sdsd', type: 'test' }, () => undefined).catch(
		(e) => {
			expect(e.message).toEqual('store <sdsd> not found.');
			done();
		}
	);
});

it('subscribeToState state not found', (done) => {
	expect.assertions(1);
	const target = testStore(11);
	subscribeToState(
		{ name: target.store.name, type: 'testError' },
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