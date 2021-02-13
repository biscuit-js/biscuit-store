import { ReactComponent } from './component';
import { DispatchToProps, StateToProps, Deps } from './interfaces';


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
): ReactComponent<T>;

/**
 * ### Subscribe
 * Allows you to bind a set of actions and dispatchers
 * to a component, updates the component, and retrieves data.
 * @param stateToProps props list
 * @param dispatchToProps dispatch list
 * @return React component
 */
declare function subscribe<S = {}, R = {}, P = any, >(
    stateToProps: StateToProps<S, R>,
    dispatchToProps: DispatchToProps
): (Element: ReactComponent<P>) => ReactComponent<P>;