/* eslint-disable no-console */
import { testAdd, testStep, testFetch, testInclude, testExecute } from '../store/test';
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

	testFetch.subscribe<ITestStore>((state) => {
		console.log(state.data);
	});

	(async function () {
		const arr = new Array(5).fill(1);
		for (let key of arr) {
			await testAdd.dispatch<TestStorePayload>((prev) =>
				({ value: prev.value + key })).wait;
		}
	}());

	testFetch.dispatch({ data: 'Ready!!!' });

	testExecute.subscribe((state) => {
		console.log(state);
	});

	setTimeout(() => {
		testInclude.dispatch({ data: 'Box' });
	}, 2000);

	testExecute.dispatch({ title: 'delivered' });
}