import { StateAction, Context } from '@biscuit-store/types';

/** Type for getAction method */
export type GetAction = (actionName: string) => StateAction;

/** Type for send method */
export type Send = (newPayload: any) => void;

/** adapter action context */
export interface AdapterActionCtx<P = object, S = object> {
	payload: P;
	state: S;
	getAction: GetAction;
	send: Send;
}

/**
 * Type for adapter listener
 * @param payload payload data
 * @param state state data
 * @param ctx response methods
 */
export type ActionListner<T, P, S> = (
	ctx: AdapterActionCtx<P, S>
) => T | Promise<T> | void;

/**
 * Type of the result handler
 * @param result data after processing the synchronous function
 * @param state state data
 * @param ctx response methods
 */
export type CallHandler<T, S> = (result: T, ctx: AdapterActionCtx<S>) => any;

/** Channel type */
export interface Channel {
	/**
	 * The function writes data to the channel.
	 * @param  payload the data for a send
	 */
	include: <T>(payload: T) => void;

	/**
	 * Function for extracting data from a channel.
	 * @param payload the data for a mail merge
	 * @return Promise
	 */
	extract: <T>(payload: T) => Promise<any>;
}

export type ListnerItem<A, B> = <P = A, S = B, T = any>(
	ctx: AdapterActionCtx<P, S>
) => T | Promise<T | P | S>;

/** Adapter returned interface */
export interface Adapter {
	/**
	 * Connector for biscuit middleware
	 * launches tasks from the scheduler when an action is triggered
	 * @param context contains action parameters
	 * @param next callback function
	 */
	connect: (context: Context, next: <T>(newPayload?: T) => void) => void;
	/**
	 * Create action
	 * adds an action to the scheduler
	 * @param actionName action name
	 * @param fn callback function
	 */
	action: <T = {}, P = {}, S = {}>(
		actionName: string,
		fn: ActionListner<T, P, S>
	) => void;

	/**
	 * This method implements the logic identical to promise.all.
	 * @param actionName action name
	 * @param handler handler of the received result
	 * @param fns arrauy async functions
	 */
	all: <A, B, C>(
		actionName: string,
		handler: (result: C) => void,
		fns: Array<ListnerItem<A, B>>
	) => void;

	/**
	 * This method implements the logic identical to promise.race.
	 * @param actionName action name
	 * @param handler handler of the received result
	 * @param fns arrauy async functions
	 */
	race: <A, B, C>(
		actionName: string,
		handler: (result: C) => void,
		fns: Array<ListnerItem<A, B>>
	) => void;

	/**
	 * This method allows you to call an action with the debounce effect
	 * @param actionName action name
	 * @param fn listner function
	 * @param limit time limit
	 */
	debounce: <T = {}, P = {}, S = {}>(
		actionName: string,
		fn: ActionListner<T, P, S>,
		limit: number,
		immediate: boolean
	) => void;

	/**
	 * This method allows you to call an action with the debounce effect
	 * @param actionName action name
	 * @param fn listner function
	 * @param limit time limit
	 */
	throttle: <T = {}, P = {}, S = {}>(
		actionName: string,
		fn: ActionListner<T, P, S>,
		limit: number
	) => void;

	/**
	 * Сall async method
	 * сalls an asynchronous function and handler in the scheduler.
	 * @param ctionName action name
	 * @param fn async function
	 * @param handler handler of the received result
	 */
	call: <T = {}, P = {}, S = {}>(
		actionName: string,
		fn: ActionListner<T, P, T>,
		handler?: CallHandler<T, S>
	) => void;

	/**
	 * Allows you to include the dataset in the adapter context
	 * can get data from asynchronous asynchronous function
	 * @param ctxCreator context creator function
	 * @param options behavioral options
	 * @async
	 */
	includeContext: <T = object>(
		ctxCreator: () => T,
		options?: { catche: boolean }
	) => void;

	/**
	 * Function for creating a channel
	 */
	makeChannel: () => Channel;
}
