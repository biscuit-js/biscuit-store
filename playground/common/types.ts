import { ITestStore } from './interfaces';

export type BranchName = { name: string };
export type TestStorePayload = (prev: ITestStore) => {value: number};