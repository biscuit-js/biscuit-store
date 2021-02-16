/* eslint-disable no-console */
import { testAdd, testStep } from '../store/test';
import { ITestStore } from '../common/interfaces';
import { BranchName, TestStorePayload } from '../common/types';

type BrenchState = ITestStore & BranchName;

export function dispatchPreview() {
    testAdd.subscribe<ITestStore>((state) => {
        console.log(state);
    });

    testStep.subscribe<BrenchState>((state) => {
        console.log(state.name);
    });

    (async function () {
        const arr = new Array(5).fill(1);
        for (let key of arr) {
            await testAdd.dispatch<TestStorePayload>((prev) => ({ value: prev.value + key })).wait;
        }
    }());
}