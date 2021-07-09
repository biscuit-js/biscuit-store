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
	add: (instance: any) => void;
}

/**
 * The interface describes
 * the store parameters generated by createStore
 */
export interface StoreParams <I> {
	store: Store<I>;
	actions: { [propName: string]: StateAction };
}


/**
 * The interface describes
 * a set of createStore options
 */export interface StoreSettings<T = {[key: string]: any }> {
	/** The store params */
	name: string;
	/** store initial object */
	initial: T;
	/** State parameters */
	actions?: Actions;
	/** Array of middleware functions */
	middleware?: Middleware[];
	/** Debugger function */
	debugger?: DebuggerListener;
	/**
	 * Runs a method that writes the object
	 * to the store during initialization
	 */
	initialCall?: (store?: T) => void;
	/** Combined actions */
	combineActions?: {
		[propName: string]:
		<P = object>(state?: T, payload?: P) => void;
	};
	/** Add actions container */
	addToContainer?: boolean;
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

/** Type for the action container */
export interface Container {
	/**
	 * The method allows you to put actions in a container
	 * @param actions actions object
	 */
	include: (actions: {[propName: string]: StateAction}) => void;
	/**
	 * The method allows you to put actions in a container
	 * @param storeName store name
	 * @return actions
	 */
	extract: (storeName: string) => {[propName: string]: StateAction};
}

/** The type describes the arguments of the combineActions method */
export type CombineProto<S = object> =
{ [propName: string]: <P = object>(state?: S, payload?: P) => void };

/** The interface describes the returned combineActions parameters */
export interface CombineActions {
	middleware: Middleware[];
	actions: Actions;
};