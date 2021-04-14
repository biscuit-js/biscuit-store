import { CreateError } from './debugger';
import { repositories, settings } from './repositories';
import { getStore, subscribeToStore, addStore } from './store';
import { typeOf } from './utils';
import { checkStoreName } from './helper';
import { messages } from './messages';

/**
 * This method is responsible for creating a new store.
 * Takes as the first argument a string with the store name.
 * and the initial state of the storage as the second argument
 * @param {string} name storage name
 * @param {import('../../types/store').Store} initial initial object
 * @public
 */
export function newStore(name, initial = {}) {
	if (!name) {
		throw new CreateError(messages.noStoreName);
	}

	if (typeof name !== 'string') {
		throw new CreateError(messages.storageNameError('newStore'));
	}

	if (typeOf(initial) !== 'object') {
		throw new CreateError(messages.initialType, name);
	}

	if (settings.strictMode[name]) {
		checkStoreName(name);
	}

	repositories[name] = { content: initial, actions: {} };

	return {
		name,
		/** Subscribe by change @param {function} fn */
		subscribe: (fn) => subscribeToStore(name, fn),
		/** get reposiory */
		get: () => getStore(name),
		/** add to reposiory @param {object} instance */
		add: (instance) => addStore(name, instance),
	};
}