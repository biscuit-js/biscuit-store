/* eslint-disable sonarjs/no-duplicate-string */
import { createAdapter } from '../src/index';
import { testStore } from './testStore';

it('calling action', (done) => {
    expect.assertions(2);

    const adapter = createAdapter();
    adapter.action('add/action', (payload) => {
        expect(payload.value).toEqual(1);
        return payload;
    });


    const { add } = testStore('test-1', adapter);

    add.subscribe((state) => {
        expect(state.value).toEqual(1);
        done();
    });
    add.dispatch({ value: 1 });
});

it('check payload and store', (done) => {
    expect.assertions(2);

    const adapter = createAdapter();
    adapter.action('add/action', (payload, store) => {
        expect(payload.value).toEqual(1);
        expect(store.value).toEqual(0);
        done();
    });


    const { add } = testStore('test-2', adapter);
    add.dispatch({ value: 1 });
});

it('calling multiple actions', (done) => {
    expect.assertions(3);

    const adapter = createAdapter();

    adapter.action('add/action', (payload) => {
        expect(payload.value).toEqual(1);
        return payload;
    });

    adapter.action('add/remove', (payload) => {
        expect(payload.value).toEqual(2);
        return payload;
    });

    const { add, remove, store } = testStore('test-3', adapter);

    store.subscribe((state) => {

        if (state.value === 2) {
            expect(state.value).toEqual(2);
            done();
            return;
        }

        expect(state.value).toEqual(1);
    });
    add.dispatch({ value: 1 });
    remove.dispatch({ value: 2 });
});

it('check context.send', (done) => {
    expect.assertions(1);

    const adapter = createAdapter();
    adapter.action('add/action', (payload, _, { send }) => {
        setTimeout(() => {
            send({ value: payload.value + 2 });
        }, 1000);
    });


    const { add } = testStore('test-4', adapter);

    add.subscribe((state) => {
        expect(state.value).toEqual(3);
        done();
    });

    add.dispatch({ value: 1 });
});

it('check context.getAction', (done) => {
    expect.assertions(2);

    const adapter = createAdapter();
    adapter.action('add/action', (payload, _, { getAction }) => {
        getAction('remove/action').dispatch({ value: 10 });
        return payload;
    });

    adapter.action('add/remove', (payload, _, { send }) => {
        send({ value: 5 });
    });


    const { add, remove } = testStore('test-5', adapter);

    add.subscribe((state) => {
        expect(state.value).toEqual(5);
    });

    remove.subscribe((state) => {
        expect(state.value).toEqual(10);
        done();
    });

    add.dispatch({ value: 5 });
});

it('not send', (done) => {
    expect.assertions(1);

    const adapter = createAdapter();
    adapter.action('add/action', (payload) => {
        expect(payload.value).toEqual(5);
    });

    const { add } = testStore('test-6', adapter);

    add.subscribe((state) => {
        done();
    });

    setTimeout(() => {
        done();
    }, 1000);

    add.dispatch({ value: 5 });
});