/* eslint-disable sonarjs/no-duplicate-string */
import { createAdapter } from '../src/index';
import { testStore } from './testStore.js';

it('calling async function', (done) => {
    expect.assertions(3);

    const adapter = createAdapter();

    const func = async (payload, store) => {
        expect(store.value).toEqual(0);
        expect(payload.value).toEqual(10);
        return await new Promise((resolve) => {
            setTimeout(() => {
                resolve({ value: payload.value + store.value });
            }, 1000);
        });
    };

    adapter.call('add/action', func);

    const { add } = testStore('test-1', adapter);

    add.subscribe((state) => {
        expect(state.value).toEqual(10);
        done();
    });

    add.dispatch({ value: 10 });
});

it('calling async function and handling', (done) => {
    expect.assertions(2);

    const adapter = createAdapter();

    const func = async (payload, store) => {
        return await new Promise((resolve) => {
            setTimeout(() => {
                resolve({ value: payload.value + store.value });
            }, 1000);
        });
    };

    adapter.call('add/action', func, (data) => {
        expect(data.value).toEqual(100);
        return { value: data.value * 2 };
    });

    const { add } = testStore('test-2', adapter);

    add.subscribe((state) => {
        expect(state.value).toEqual(200);
        done();
    });

    add.dispatch({ value: 100 });
});

it('multy calling', (done) => {
    expect.assertions(2);

    const adapter = createAdapter();

    const func = async (payload, _, { getAction }) => {
        getAction('remove/action').dispatch({ value: 100 });
        return await new Promise((resolve) => {
            setTimeout(() => {
                resolve({ ...payload });
            }, 1000);
        });
    };

    const func2 = async (payload) => {
        return await new Promise((resolve) => {
            resolve({ ...payload });
        });
    };

    adapter.call('add/action', func);
    adapter.call('remove/action', func2);

    const { add, remove } = testStore('test-3', adapter);

    add.subscribe((state) => {
        expect(state.value).toEqual(10);
        done();
    });

    remove.subscribe((state) => {
        expect(state.value).toEqual(100);
    });

    add.dispatch({ value: 10 });
});