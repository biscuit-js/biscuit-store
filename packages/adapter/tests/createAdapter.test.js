import { createAdapter } from '../src/index';

it('create new adapter', () => {
    expect(typeof createAdapter).toEqual('function');
});

it('create new adapter', () => {
    const adapter = createAdapter();
    expect(typeof adapter).toEqual('object');
    expect(typeof adapter.action).toEqual('function');
    expect(typeof adapter.call).toEqual('function');
    expect(typeof adapter.makeChannel).toEqual('function');
    expect(typeof adapter.connect).toEqual('function');
});

