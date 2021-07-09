//
import { createAdapter } from '../../../packages/adapter';
import { ITestStore } from '../../common/interfaces';

const { action, connect, makeChannel, race } = createAdapter();

const chan = makeChannel();

const testFirst = ({ payload }) => {
	return new Promise((resolve) => {
		setTimeout(() => resolve(payload), 100);
	});
};

const testLast = ({ payload }) => {
	return new Promise((resolve) => {
		setTimeout(() => resolve(payload), 100);
	});
};

action<ITestStore, ITestStore>('test/include', ({ payload, send }) => {
	send(payload);
});


race<ITestStore, ITestStore>('test/execute', (result) => {
	return result;
}, [testFirst, testLast]);

export { connect };