import { getStore, getState, utils } from '@biscuit-store/core';
const { CreateError } = utils;

/** Get state or store data */
export const getData = (name, type) => {
    if (type) {
        return getState({ name, type });
    }

    return getStore(name);
};

/** Collects source data from dependent stores */
export const loopDeps = (deps, res) => {
    if (!deps.length) {
        throw new CreateError('The observer must have dependencies.');
    }
    let result = res;
    for (let dep of deps) {
        result = { ...result, ...getData(dep.name, dep.type) };
    }
    return result;
};