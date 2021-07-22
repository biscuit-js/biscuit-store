import { StateAction, Context } from '@biscuit-store/types';

/** Type for getAction method */
export type GetAction<S> = (actionName: string) => StateAction<S>;

/** Type for send method */
export type Send = (newPayload: any) => void;

/** adapter action context */
export interface AdapterActionCtx<S = object, P = object> {
	payload: P;
	state: S;
	getAction: GetAction<S>;
	send: Send;
}

/**
 * Type for adapter listener
 * @param payload payload data
 * @param state state data
 * @param ctx response methods
 */
export type ActionListner<S, P> = (
	ctx: AdapterActionCtx<S, P>
) => S | Promise<S> | void;

/**
 * Type of the result handler
 * @param result data after processing the synchronous function
 * @param state state data
 * @param ctx response methods
 */
export type CallHandler<S> = (result: S, ctx: AdapterActionCtx<S>) => any;

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

export type ListnerItem<S = any, P = any> = (
	ctx: AdapterActionCtx<S, P>
) => S | Promise<any>;

/** Adapter returned interface */
export interface Adapter {
	/**
	 * Connector for biscuit middleware
	 * launches tasks from the scheduler when an action is triggered
	 * @param context contains action parameters
	 * @param next callback function
	 */
	connect: <S = any, P = any>(
		context: Context<S>,
		next: (newPayload?: P) => void
	) => void;
	/**
	 * Create action
	 * adds an action to the scheduler
	 * @param actionName action name
	 * @param fn callback function
	 */
	action: <S = {}, P = {}>(
		actionName: string,
		fn: ActionListner<S, P>
	) => void;

	/**
	 * This method implements the logic identical to promise.all.
	 * @param actionName action name
	 * @param handler handler of the received result
	 * @param fns arrauy async functions
	 */
	all: <S = {}, P = {}, H = any>(
		actionName: string,
		handler: (result: H) => void,
		fns: Array<ListnerItem<S, P>>
	) => void;

	/**
	 * This method implements the logic identical to promise.race.
	 * @param actionName action name
	 * @param handler handler of the received result
	 * @param fns array async functions
	 */
	race: <S = {}, P = {}, H = any>(
		actionName: string,
		handler: (result: H) => void,
		fns: Array<ListnerItem<S, P>>
	) => void;

	/**
	 * This method allows you to call an action with the debounce effect
	 * @param actionName action name
	 * @param fn listner function
	 * @param limit time limit
	 */
	debounce: <S = {}, P = {}>(
		actionName: string,
		fn: ActionListner<S, P>,
		limit: number,
		immediate: boolean
	) => void;

	/**
	 * This method allows you to call an action with the debounce effect
	 * @param actionName action name
	 * @param fn listner function
	 * @param limit time limit
	 */
	throttle: <S = {}, P = {}>(
		actionName: string,
		fn: ActionListner<S, P>,
		limit: number
	) => void;

	/**
	 * Сall async method
	 * сalls an asynchronous function and handler in the scheduler.
	 * @param ctionName action name
	 * @param fn async function
	 * @param handler handler of the received result
	 */
	call: <S = {}, P = {}>(
		actionName: string,
		fn: ActionListner<S, P>,
		handler?: CallHandler<S>
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
