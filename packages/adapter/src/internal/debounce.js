import { debounce, throttle } from './utils';
const types = { debounce, throttle };
/**
 * This method allows you to call an action with the debounce effect
 * @param {string} actionName action name
 * @param {function} fn listner function
 * @param {number} limit time limit
 * @param {bool} immediate first call
 */
export function runCallEffect({ fn, limit, type }) {
	const func = types[type](fn, limit);
	return async (context, next) => {
		let { payload, state, getAction, current } = context;
		func({
			...current,
			payload,
			state,
			getAction,
			send: next,
		});
	};
}