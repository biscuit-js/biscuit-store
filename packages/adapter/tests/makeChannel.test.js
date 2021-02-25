import { createAdapter } from '../src/index';
import { createStore } from '../../biscuit-store';

export const testStore = (name, adapter) => {
    const { store, actions } = createStore({
        repo: {
            name,
            initial: { value: 0 },
        },
        states: {
            add: 'add/action',
            remove: 'remove/action',
        },
        middleware: [adapter.connect],
        strictMode: false,
    });

    return {
        store,
        add: actions.add,
        remove: actions.remove,
    };
};

it('calling action', (done) => {
    expect.assertions(2);
    const adapter = createAdapter();
    const chan = adapter.makeChannel();

    adapter.action('add/action', (payload) => {
        chan.include(payload);
        return payload;
    });

    adapter.action('remove/action', async (payload) => {
        return await chan.extract(payload);
    });

    const { add, remove } = testStore('test-1', adapter);

    add.subscribe((state) => {
        expect(state.value).toEqual(10);
    });

    remove.subscribe((state) => {
        expect(state).toEqual({ value: 10, data: 20 });
        done();
    });

    setTimeout(() => {
        add.dispatch({ data: 20 });
    }, 1000);

    remove.dispatch({ value: 10 });
});