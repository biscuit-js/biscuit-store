import { createStore } from '../../../packages/biscuit-store';
import { adapter } from './adapter';

const { actions, store } = createStore({
    name: 'user',
    initial: { value: 0, data: '' },
    actions: {
        testAdd: 'test/add',
        testRemove: 'test/remove',
        testStep: {
            name: 'test/step',
            branch: true,
            initial: { name: '' },
        },
        testFetch: 'test/fetch',
        testInclude: 'test/include',
        testExecute: 'test/execute',
    },
    middleware: [adapter.connect],
});

export const testStore = store;
export const {
    testAdd,
    testRemove,
    testStep,
    testFetch,
    testInclude,
    testExecute,
} = actions;