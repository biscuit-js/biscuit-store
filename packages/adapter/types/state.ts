/**
 * This type defines the payload in the dispatch
 */
export type DispatchPayload = (<T>(prev: T) => object) | object;

/**
 * This type defines the subscription function
 */
export type SubscribeListner<T> = (state: T) => void;

/** The interface defines the action parameters for the state */
export interface StateAction {
    repo: string;
    state: string;
    dispatch: <T>(payload: T) => Dispatcher;
    subscribe: <T>(fn: SubscribeListner<T>) => Promise<T>;
    getState: <T>() => T;
}

/**
 * This interface describes
 * the methods returned by dispatch
*/
export interface Dispatcher {
    /**
	 * Call before state change
	 * @param {SubscribeListner} fn callback
	 */
    before: <T>(fn: SubscribeListner<T>) => void;
    /**
	 * Call after state change
	 * @param {SubscribeListner} fn callback
	 * @async
	 */
    after: <T>(fn: SubscribeListner<T>) => void;
    /**
	 * Merge state into repository
	 */
    merge: () => void;
};
