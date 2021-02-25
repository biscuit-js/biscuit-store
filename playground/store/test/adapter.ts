import {
    createAdapter,
} from '../../../packages/adapter';
import { ITestStore } from '../../common/interfaces';
import { BranchName, TestFetchPayload } from '../../common/types';

const fetchFunc = async (payload: TestFetchPayload): Promise<TestFetchPayload> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(payload);
        }, 5000);
    });
};

const adapter = createAdapter();

adapter.action<ITestStore, ITestStore, ITestStore>('test/add', (payload, state, { getAction }) => {
    getAction('test/step').dispatch<BranchName>({ name: 'prev: ' + state.value });
    return { value: payload.value * 10 };
});

adapter.call<TestFetchPayload, TestFetchPayload, ITestStore>('test/fetch', fetchFunc);

const chan = adapter.makeChannel();

adapter.action('test/include', (payload) => {
    chan.include(payload);
    return {};
});

adapter.action('test/execute', async (payload) => {
    return await chan.extract(payload);
});

export { adapter };