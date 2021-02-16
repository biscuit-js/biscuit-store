import {
    createAdapter,
} from '../../../packages/adapter';
import { ITestStore } from '../../common/interfaces';
import { BranchName } from '../../common/types';

const adapter = createAdapter();

adapter.action<ITestStore, ITestStore, ITestStore>('test/add', (payload, state, { getAction }) => {
    getAction('test/step').dispatch<BranchName>({ name: 'prev: ' + state.value });
    return { value: payload.value * 10 };
});

export { adapter };