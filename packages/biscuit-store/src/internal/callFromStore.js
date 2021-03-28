import { addStore, getStore } from './store';
import { CreateError } from './debugger';
import { typeOf } from './utils';

/**
 * The method makes an asynchronous call
 * and pours the result into the storage.
 * @param {import('../../types/store').Store} store
 * the parameters of the action
 * @param {function} fn callback
 * @async
 * @public
 */
export async function callFromStore(store, fn) {
	const result = await fn(getStore(store));
	if (typeOf(result) !== 'object') {
		throw new CreateError('The result of the call must return an object.');
	}

	addStore(store, result);
}