//
import { ReactComponent } from './component';
import {
	DispatchToProps,
	StateToProps,
	Deps,
	Dep,
	DepsAction,
	ModifyDispatch,
	ListenMethod,
	ListenReplace,
} from './interfaces';
import { Dispatch, AnyAction, StateAction, Store } from '@biscuit-store/types';

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
	action: AnyAction,
	count: number
): ModifyDispatch;

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
	action: AnyAction,
	count: number,
	immediate: boolean
): ModifyDispatch;

/**
 * The listen method listens to a store or action.
 * If the values of the storage object match the values
 * of the mask object specified in the parameters.
 * then the react component will be manipulated
 * depending on the method called from the closure.
 * @param event action and store (not static action)
 * @param exp mask object
 * @return methods
 */
declare function listen<T, P = any>(
	event: StateAction | Store,
	exp: T
): {
	/**
	 * The render method mounts the component
	 * if the mask and storage parameters match,
	 * and unmounts it if it does not match.
	 * @param Component react component
	 * @return react component
	 */
	render: ListenMethod<P>;
	/**
	 * The method replaces the component with the specified one
	 * if the mask and storage parameters match.
	 * @param {ReactComponent} Component react component
	 * @param {ReactComponent} NewComponent new react component
	 * @return {ReactComponent} react component
	 */
	repcace: ListenReplace<P>;
	/**
	 * Updating a component when the mask and storage values match
	 * @param Component react component
	 * @return react component
	 */
	update: ListenMethod<P | any>;
};