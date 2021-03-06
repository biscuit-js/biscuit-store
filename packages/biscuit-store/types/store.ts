import { SubscribeListner, StateAction, StateObject } from './state';

/**
 * The interface describes
 * the state parameters for createStore
 */
export interface Actions {
	[propName: string]: string | StateObject;
}

/**
 * The interface describes
 * the context of the middleware function
 */
export interface Context {
	/** The action name */
	action: string;
	/** The store name */
	store: string;
	/** payload for the state */
	payload: object;
	/** current state */
	state: object;
	/** get action */
	getAction: (actionName: string) => StateAction;
}

/**
 * the interface describes
 * the parameters of the middleware function
 */
export type Middleware = (
	context: Context,
	next: <T>(newPayload?: T) => void
) => object | void;

/**
 * The interface describes
 * the methods returned by the middleware function
 */
export interface MiddlewareParams {
	/**
     * Adds a handler to the middleware task list.
     * @param fn middleware listner function
     */
	add: (fn: (Middleware)) => void;
}

/**
 * The interface describes
 * the methods returned by the newStore function
 */
export interface Store<I = any> {
	/** Returns the name of the store */
	name: string;
	/**
     * Subscribe by change
     * @param fn listener
     */
	subscribe: <T extends I>(fn?: SubscribeListner<T>) => Promise<T>;
	/**
     * Get reposiory
     */
	get: () => I;
	/**
     * Add to reposiory
     * @param instance object
     */
	add: (instance: I) => void;
}

/**
 * The interface describes
 * the store parameters generated by createStore
 */
export interface StoreParams <A extends StateAction, I> {
	store: Store<I>;
	actions: { [propName: string]: A };
}

/**
 * The interface describes
 * a set of createStore options
 */
export interface StoreSettings {
	/** The store params */
	name: string;
	/** store initial object */
	initial: object;
	/** State parameters */
	actions?: Actions;
	/** Array of middleware functions */
	middleware?: Middleware[];
	/** Debugger function */
	debugger?: DebuggerListener;
	/** Enable or disable strict mode */
	strictMode?: boolean;
}
/**
 * The interface describes
 * the object returned by the debugger function
 */
export interface DebuggerItem {
	/** Debugger message */
	message: string;
	/** File url */
	file: string;
	/** Log level */
	level: string;
	/** Target store */
	name: string;
	/** Log type */
	type: string;
}

/** The type describes the listener of the debugger */
export type DebuggerListener = (e: DebuggerItem) => void;
