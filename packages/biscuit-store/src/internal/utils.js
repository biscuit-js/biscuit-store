/**
 * Creates a throttled function that only invokes func
 * at most once per every wait milliseconds.
 * @param {function} callback target function
 * @param {number} limit counter
 * @return {function}
 */
export function throttle(callback, limit) {
	let waiting = false;
	return function () {
		if (!waiting) {
			callback.apply(this, arguments);
			waiting = true;
			setTimeout(() => {
				waiting = false;
			}, limit);
		}
	};
}

/**
 * Creates a debounced function that delays invoking func
 * until after wait milliseconds have elapsed since
 * the last time the debounced function was invoked.
 * @param {function} callback target function
 * @param {number} limit counter
 * @return {function}
 */
export function debounce(callback, limit, immediate) {
	let timeout;
	function debounced(...args) {
		const that = this;
		const later = () => {
			callback.apply(that, args);
		};
		clearTimeout(timeout);
		if (immediate) {
			later();
		};
		timeout = setTimeout(later, limit);
	}

	debounced.clear = () => {
		clearTimeout(timeout);
	};

	return debounced;
}

/**
 * This method set allows you to. save the state of functions
 * tied to the timer. Required for the case when the timer
 * function is initialized in a method with a frequent call,
 * for example, in the react function component.
 * @param {function} fn target function
*/
export const sandbox = (fn) => {
	return {
		run: (function () {
			let than = null;

			/** initial run
             * @param {function} call target function
             * @param {number} timer timeout
            */
			const initial = (call, timer, immediate = undefined) => {
				if (!than) {
					than = fn(call, timer, immediate);
				}
			};

			/** initial run
             * @param {args[any]} args arguments
             * @return {function}
             */
			const caller = (...args) => {
				return than(...args);
			};

			/** initial
            * @param {function} call target function
            * @param {number} timer timeout
            * @return {function} throttleCaller
            */
			return (call, timer, immediate) => {
				initial(call, timer, immediate);
				return caller;
			};
		})(),
	};
};

/**
 * Strict type checking
 * @param {*} value any value
 */
export function typeOf(value) {
	const regex = /^\[object (\S+?)]$/;
	const matches = Object.prototype.toString.call(value).match(regex) || [];
	return (matches[1] || 'undefined').toLowerCase();
}
