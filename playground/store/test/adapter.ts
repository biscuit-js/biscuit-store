//
import { createAdapter } from '../../../packages/adapter';
import { AdapterActionCtx } from '../../../packages/adapter/types';
import { ITestStore } from '../../common/interfaces';

const { debounce, connect, makeChannel, race } = createAdapter();

const chan = makeChannel();

const testFirst = <P, S>
({ payload }: AdapterActionCtx<P, S>): Promise<P> => {
	return new Promise((resolve) => {
		setTimeout(() => resolve(payload), 100);
	});
};

const testLast = <P, S>
({ payload }: AdapterActionCtx<P, S>): Promise<P> => {
	return new Promise((resolve) => {
		setTimeout(() => resolve(payload), 100);
	});
};

debounce<ITestStore, ITestStore, ITestStore>('test/include', ({ payload, send }) => {
	console.log("payload", payload);
	send(payload);
}, 300);


race<ITestStore, ITestStore, ITestStore>('test/execute', (result) => {
	console.log("result", result);
	return result;
}, [testFirst, testLast]);

export { connect };