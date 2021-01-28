import {
    newRepo,
    getRepo,
    addRepo,
} from '../index';

it('change new repository function not error', () => {
    expect(() => {
        newRepo('test', { data: 'test' });
    }).not.toThrow();
});

it('change new repository function', () => {
    const testRepo = newRepo('test-1', { data: 'test-1' });
    expect(testRepo.repo).toEqual('test-1');

    expect(testRepo.get).not.toBeUndefined();
    expect(testRepo.add).not.toBeUndefined();
    expect(testRepo.subscribe).not.toBeUndefined();

    expect(testRepo.get).not.toBeNull();
    expect(testRepo.add).not.toBeNull();
    expect(testRepo.subscribe).not.toBeNull();
});

it('change newRepo.get', () => {
    const input = { data: 'test-2' };
    const testRepo = newRepo('test-2', input);
    expect(testRepo.get()).toEqual(input);
    expect(getRepo('test-2')).toEqual(input);
});

it('change newRepo.add', () => {
    const input1 = { data: 'replace-test', id: 0 };
    const input2 = { data: 'replace-test-1', id: 1 };
    const testRepo = newRepo('test-3', { data: 'test-3' });
    expect(testRepo.get()).toEqual({ data: 'test-3' });
    testRepo.add(input1);
    expect(testRepo.get()).toEqual(input1);

    addRepo('test-3', input2);
    expect(testRepo.get()).toEqual(input2);
});

it('change newRepo.get write error', () => {
    const testRepo = newRepo('test-4', { data: 'test-4' });
    expect(() => {
        testRepo.get().data = 'error';
    }).toThrowError(
        new Error('Cannot assign to read only property \'data\' of object \'#<Object>\'')
    );
});

it('change newRepo not name', () => {
    expect(() => {
        newRepo(null, { data: 'test-5' });
    }).toThrowError(new Error('The repository name is a required field.'));
});

it('change newRepo already exists', () => {
    expect(() => {
        newRepo('test-6', {});
        newRepo('test-6', {});
    }).toThrowError(new Error('A repository with this name already exists.'));
});

it('change newRepo initial type', () => {
    expect(() => {
        newRepo('test-7', []);
    }).toThrowError(new Error('The initial must be an object.'));
});

it('change addRepo initial type', () => {
    const err = 'The initial must be an object.';
    const testRepo = newRepo('test-8', { data: 'test-8' });
    expect(() => {
        testRepo.add([]);
    }).toThrowError(new Error(err));

    expect(() => {
        addRepo('test-8', 1);
    }).toThrowError(new Error(err));
});

it('change getRepo not repo', () => {
    expect(() => {
        getRepo('test-22');
    }).toThrowError(new Error('repository <test-22> not found.'));
});

it('change addRepo not repo', () => {
    expect(() => {
        addRepo('test-33', {});
    }).toThrowError(new Error('repository <test-33> not found.'));
});