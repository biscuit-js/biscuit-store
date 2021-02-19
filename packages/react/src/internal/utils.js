import { getRepo, getState } from '@biscuit-store/core';
import { utils } from '@biscuit-store/core';
const { CreateError } = utils;

/** Get state or repository data */
export const getData = (repo, state) => {
    if (state) {
        return getState({ repo, state });
    }

    return getRepo(repo);
};

/** Collects source data from dependent stores */
export const loopDeps = (deps, res) => {
    if (!deps.length) {
        throw new CreateError('The observer must have dependencies.');
    }
    let result = res;
    for (let dep of deps) {
        result = { ...result, ...getData(dep.repo, dep.state) };
    }
    return result;
};