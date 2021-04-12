import { CreateError } from './debugger';
import { repositories, middlewares } from './repositories';
import { messages } from './messages';

/**
 * This method allows you to add middleware for the state handler.
 * @param {import('../../types/store').Store} store the store params
 * @return {import('../../types/store').MiddlewareParams}
 * returns a set of methods
 * @public
 */
export function middleware(store) {
	if (!repositories[store.name]) {
		throw new CreateError(messages.noStore(store.name));
	}

	const s = store.name;
	return {
		/**
		 * Adds a handler to the middleware task list.
		 * @param {function} fn middle function
		 * @public
		 */
		add: (fn) => {
			if (typeof fn !== 'function') {
				throw new CreateError(messages.middleNoFunc, s);
			}

			if (middlewares[s]) {
				middlewares[s].push(fn);
			} else {
				middlewares[s] = [fn];
			}
		},
	};
}