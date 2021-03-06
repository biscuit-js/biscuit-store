import { utils, dispatch } from '@biscuit-store/core';
const { sandbox, throttle, debounce } = utils;

const boxThrottle = sandbox(throttle);
const boxDebounce = sandbox(debounce);

/**
 * ### useDispatch
 * State dispatcher hook
 * accepts multiple actions and returns them to dispatchers
 * @param {...import('../../../types').StateAction} actions actions list
 * @return {import('@biscuit-store/types').Dispatcher[]} dispatch list
 * @public
 */
export function useDispatch(...actions) {
	return actions.map((action) => (payload = {}) => dispatch(action, payload));
}

/**
 * ### useDispatchThrottle
 * Creates a throttled function that only invokes dispatch
 * at most once per every wait milliseconds.
 * @param {number} count throttle timer
 * @param {...import('../../../types').StateAction} actions actions list
 * @return {import('../../types/interfaces').ModifyDispatch[]}  dispatch list
 * @public
 */
export function useDispatchThrottle(action, count) {
	return (payload = {}) => boxThrottle.run(dispatch, count)(action, payload);
}

/**
 * ### useDispatchDebounce
 * Creates a debounced function that delays invoking dispatch
 * until after wait milliseconds have elapsed since
 * the last time the debounced function was invoked.
 * @param {number} count throttle timer
 * @param {...import('../../../types').StateAction} actions actions list
 * @return {import('../../types/interfaces').ModifyDispatch[]}  dispatch list
 * @public
 */
export function useDispatchDebounce(action, count, immediate) {
	return (payload = {}) =>
		boxDebounce.run(dispatch, count, immediate)(action, payload);
}
