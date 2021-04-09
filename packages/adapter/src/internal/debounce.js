import { debounce, throttle } from './utils';

/**
 * This method allows you to call an action with the debounce effect
 * @param {string} actionName action name
 * @param {function} fn listner function
 * @param {number} limit time limit
 * @param {bool} immediate first call
 */
export function runDebounce({ fn, limit, immediate }) {
	const deb = debounce(fn, limit, immediate);
	return async (context, next) => {
		let { payload, state, getAction, current } = context;

		const update = deb({
			...current,
			payload,
			state,
			send: next,
			getAction,
		});

		if (update) {
			next(update);
		}
	};
}

/**
 * This method allows you to call an action with the throttle effect
 * @param {string} actionName action name
 * @param {function} fn listner function
 * @param {number} limit time limit
 */
export function runThrottle({ fn, limit }) {
	const thr = throttle(fn, limit);
	return async (context, next) => {
		let { payload, state, getAction, current } = context;

		const update = thr({
			...current,
			payload,
			state,
			send: next,
			getAction,
		});

		if (update) {
			next(update);
		}
	};
}