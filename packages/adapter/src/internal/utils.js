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
export function debounce(callback, limit) {
	let timeout;
	function debounced(...args) {
		const that = this;
		const later = () => {
			callback.apply(that, args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, limit);
	}

	debounced.clear = () => {
		clearTimeout(timeout);
	};

	return debounced;
}