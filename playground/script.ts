/* eslint-disable no-console */
import {
    createStore,
} from '../packages/biscuit-store';


const { actions } = createStore({
    repo: {
        name: 'user',
        initial: { value: 0 },
    },
    states: {
        testAdd: 'TEST/ADD',
        testRemove: 'TEST/REMOVE',
        testStep: {
            name: 'TEST/STEP',
            branch: true,
            initial: { name: 'fill' },
        },
    },
});

const { testAdd } = actions;

testAdd.subscribe((state) => {
    console.log(state);
});

(async function () {
    const arr = new Array(5).fill(1);
    for (let key of arr) {
        await testAdd.dispatch((prev) => ({ value: prev.value + key })).wait;
    }
}());
