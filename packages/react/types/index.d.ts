import { ReactComponent } from './component';
import {
	DispatchToProps,
	StateToProps,
	Deps,
	Dep,
	DepsAction,
	ModifyDispatch,
} from './interfaces';
import { Dispatch } from '@biscuit-store/types';

/**
 * ### Observer
 * The observer for the states of a component
 * Allows you to subscribe a component to one or more store states.
 * Makes an update when the state changes and forwards the changed data.
 * @param Element react element
 * @param deps dependence on the state
 * @return React component
 */
declare function observer<T = any>(
	Element: ReactComponent<T>,
	deps: Deps
): ReactComponent<T | any>;

/**
 * ### Subscribe
 * Allows you to bind a set of actions and dispatchers
 * to a component, updates the component, and retrieves data.
 * @param stateToProps props list
 * @param dispatchToProps dispatch list
 * @return React component
 */
declare function subscribe<S = {}, R = {}, P = any>(
	stateToProps: StateToProps<S, R>,
	dispatchToProps: DispatchToProps
): (Element: ReactComponent<P>) => ReactComponent<P | any>;

/**
 * ### useSubscribe
 * This hook subscribes to the state or storage.
 * @param action state params
 * @param update if false excludes update
 * @return returns the status object and the dispatcher
 * @public
 */
declare function useSubscribe<T>(action: Dep, update?: boolean): [T, Dispatch];

/**
 * ### useDispatch
 * State dispatcher hook
 * accepts multiple actions and returns them to dispatchers
 * @param actions actions list
 * @return dispatch list
 */
declare function useDispatch(...actions: DepsAction): Dispatch[];

/**
 * ### useDispatchThrottle
 * Creates a throttled function that only invokes dispatch
 * at most once per every wait milliseconds.
 * @param count wait time
 * @param actions actions list
 * @return dispatch list
 */
declare function useDispatchThrottle(
	count: number,
	...actions: DepsAction
): ModifyDispatch[];

/**
 * ### useDispatchDebounce
 * Creates a debounced function that delays invoking dispatch
 * until after wait milliseconds have elapsed since
 * the last time the debounced function was invoked.
 * @param count wait time
 * @param actions actions list
 * @return dispatch list
 */
declare function useDispatchDebounce(
	count: number,
	...actions: DepsAction
): ModifyDispatch[];