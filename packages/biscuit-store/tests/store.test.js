import { newStore, getStore, addStore } from '../src/index';

it('change new store function not error', () => {
    expect(() => {
        newStore('test', { data: 'test' });
    }).not.toThrow();
});

it('change new store function', () => {
    const testRepo = newStore('test-1', { data: 'test-1' });
    expect(testRepo.name).toEqual('test-1');

    expect(testRepo.get).not.toBeUndefined();
    expect(testRepo.add).not.toBeUndefined();
    expect(testRepo.subscribe).not.toBeUndefined();

    expect(testRepo.get).not.toBeNull();
    expect(testRepo.add).not.toBeNull();
    expect(testRepo.subscribe).not.toBeNull();
});

it('change newStore.get', () => {
    const input = { data: 'test-2' };
    const testRepo = newStore('test-2', input);
    expect(testRepo.get()).toEqual(input);
    expect(getStore('test-2')).toEqual(input);
});

it('change newStore.add', () => {
    const input1 = { data: 'replace-test', id: 0 };
    const input2 = { data: 'replace-test-1', id: 1 };
    const testRepo = newStore('test-3', { data: 'test-3' });
    expect(testRepo.get()).toEqual({ data: 'test-3' });
    testRepo.add(input1);
    expect(testRepo.get()).toEqual(input1);

    addStore('test-3', input2);
    expect(testRepo.get()).toEqual(input2);
});

it('change newStore.get write error', () => {
    const testRepo = newStore('test-4', { data: 'test-4' });
    expect(() => {
        testRepo.get().data = 'error';
    }).toThrowError(
        new Error(
            'Cannot assign to read only property \'data\' of object \'#<Object>\''
        )
    );
});

it('change newStore not name', () => {
    expect(() => {
        newStore(null, { data: 'test-5' });
    }).toThrowError(new Error('The store name is a required field.'));
});

it('change newStore initial type', () => {
    expect(() => {
        newStore('test-7', []);
    }).toThrowError(new Error('The initial must be an object.'));
});

it('change addStore initial type', () => {
    const err = 'The initial must be an object.';
    const testRepo = newStore('test-8', { data: 'test-8' });
    expect(() => {
        testRepo.add([]);
    }).toThrowError(new Error(err));

    expect(() => {
        addStore('test-8', 1);
    }).toThrowError(new Error(err));
});

it('change getStore not repo', () => {
    expect(() => {
        getStore('test-22');
    }).toThrowError(new Error('store <test-22> not found.'));
});

it('change addStore not repo', () => {
    expect(() => {
        addStore('test-33', {});
    }).toThrowError(new Error('store <test-33> not found.'));
});