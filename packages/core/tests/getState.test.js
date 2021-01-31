import { getState, createStore } from '../src/index';

const testStore = (value) => {
    return createStore({
        repo: {
            name: 'test-' + value,
            initial: { data: 123 },
        },
        states: {
            testStart: 'TEST/START',
            testStep: 'TEST/STEP',
            testStop: 'TEST/STOP',
        },
    });
};

it('change action.getState', () => {
    const target = testStore(1);
    const { testStart, testStep, testStop } = target.actions;
    expect(testStart.getState().data).toBe(123);
    expect(testStep.getState().data).toBe(123);
    expect(testStop.getState().data).toBe(123);
});

it('change action.getState', (done) => {
    expect.assertions(6);
    const target = testStore(2);
    const { testStart, testStep, testStop } = target.actions;
    expect(testStart.getState().data).toBe(123);
    expect(testStep.getState().data).toBe(123);
    expect(testStop.getState().data).toBe(123);

    testStep.dispatch({ data: 345 }).after(() => {
        expect(testStart.getState().data).toBe(345);
        expect(testStep.getState().data).toBe(345);
        expect(testStop.getState().data).toBe(345);
        done();
    });
});

it('change getState', () => {
    const target = testStore(3);
    const { testStep } = target.actions;
    expect(getState(testStep).data).toBe(123);
});

it('getState write error', () => {
    const target = testStore(4);
    const { testStep } = target.actions;
    expect(() => {
        getState(testStep).data = 'test';
    }).toThrowError(
        new Error(
            'Cannot assign to read only property \'data\' of object \'#<Object>\''
        )
    );
});

it('action.getState write error', () => {
    const target = testStore(5);
    const { testStep } = target.actions;
    expect(() => {
        testStep.getState().data = 'test';
    }).toThrowError(
        new Error(
            'Cannot assign to read only property \'data\' of object \'#<Object>\''
        )
    );
});