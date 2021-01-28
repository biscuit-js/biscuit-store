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
            setTimeout(function () {
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
    let isCooldown = false;

    return function () {
        if (isCooldown) return;
        callback.apply(this, arguments);
        isCooldown = true;
        setTimeout(() => (isCooldown = false), limit);
    };
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
            let throt = null;

            /** initial run  
             * @param {function} call target function
             * @param {number} timer timeout
            */
            const initialThrottle = (call, timer) => {
                if (!throt) {
                    throt = fn(call, timer);
                }
            };

            /** initial run 
             * @param {args[any]} args arguments
             * @return {function}
             */
            const throttleCaller = (...args) => {
                return throt(...args);
            };

            /** initial
            * @param {function} call target function
            * @param {number} timer timeout
            * @return {function} throttleCaller
            */
            return (call, timer) => {
                initialThrottle(call, timer);
                return throttleCaller;
            };
        })()
    };
};

/**
 * memoized function 
 * @param {function} fn target function
 * @return {function}
*/
export const memoize = (fn) => {
    let cache = {};
    return (...args) => {
        let n = args[0];
        if (n in cache) {
            return cache[n];
        } else {
            let result = fn(n);
            cache[n] = result;
            return result;
        }
    };
};

/**
 * Strict type checking
 * @param {*} value any value
 */
export function type(value) {
    const regex = /^\[object (\S+?)\]$/;
    const matches = Object.prototype.toString.call(value).match(regex) || [];
    return (matches[1] || 'undefined').toLowerCase();
}
