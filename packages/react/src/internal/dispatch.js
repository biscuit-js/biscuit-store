import { sandbox, throttle, debounce } from '@biscuit-store/core/src/utils';
import { dispatch } from '@biscuit-store/core';

const boxThrottle = sandbox(throttle);
const boxDebounce = sandbox(debounce);

/**
 * huck dispatch
 * @param {...object} actions state params
 * @return {array[function]} dispatch
 * @public
 */
export function useDispatch(...actions) {
    return actions.map((action) =>
        (payload = {}) => dispatch(action, payload)
    );
}

/**
 * huck dispatch: throttle
 * @param {number} count throttle timer
 * @param {...object} actions state params
 * @return {array[function]}  dispatchers
 * @public
 */
export function useDispatchThrottle(count, ...actions) {
    return actions.map((action) =>
        (payload = {}) =>
            boxThrottle.run(dispatch, count)(action, payload)
    );
}

/**
 * huck dispatch: debounce
 * @param {number} count throttle timer
 * @param {...object} actions state params
 * @return {array[function]}  dispatchers
 * @public
 */
export function useDispatchDebounce(count, ...actions) {
    return actions.map((action) =>
        (payload = {}) =>
            boxDebounce.run(dispatch, count)(action, payload)
    );
}
