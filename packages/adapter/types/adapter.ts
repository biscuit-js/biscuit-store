import { StateAction, Context } from '@biscuit-store/types';

/** Type for getAction method */
export type GetAction = (actionName: string) => StateAction;

/** Type for send method */
export type Send = (newPayload: any) => void;

/** adapter action context */
export interface AdapterActionCtx {
    getAction: GetAction;
    send: Send;
};

/**
 * Type for adapter listener
 * @param payload payload data
 * @param state state data
 * @param ctx response methods
 */
export type ActionListner<T, P, S> =
    (payload: P, state: S, ctx: AdapterActionCtx) => T;

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
    action: <T = {}, P = {}, S = {}>(actionName: string, fn: ActionListner<T, P, S>) => void;
}
