
import { createAdapter } from '../../../packages/adapter';

const adapter = createAdapter();

const chan = adapter.makeChannel();

adapter.action('test/include', (payload) => {
	chan.include(payload);
	return {};
});

adapter.action('test/execute', async (payload) => {
	return await chan.extract(payload);
});

export { adapter };