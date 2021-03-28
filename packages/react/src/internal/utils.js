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
		result = { ...result, [dep.name]: getData(dep.name, dep.type) };
	}
	return result;
};

/**
 * function for checking whether the mask
 * and storage values match
 * @param {object} params
 * @param {object} callback
 */
export function checkState({ current, event, exp, expLen }, callback) {
	let success = 0;
	for (let key in exp) {
		if (
			typeof current[event.name][key] !== 'undefined' &&
			current[event.name][key] === exp[key]
		) {
			success += 1;
		}
	}

	if (success === expLen) {
		callback();
	}
}