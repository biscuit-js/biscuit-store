import { StateAction } from './state';

/**
 * The interface describes
 * the context of the middleware function
*/
export interface Context {
    /** The action name */
    action: string;
    /** The repository name */
    repo: string;
    /** payload for the state */
    payload: object;
    /** current state */
    state: object;
    /** get action */
    getAction: (actionName: string) => StateAction;
}

type actionListner = <T = void>(payload?: object, state?: object, ctx?: object) => T;

export interface Adapter {
    /** connector for biscuit middleware
     * launches tasks from the scheduler when an action is triggered
     * @param {Context} context context contains action parameters
     * @param {function} next callback function
     * @public
     */
    connect: (context: Context, next: <T>(newPayload?: T) => void) => void;
    /** create action
     * adds an action to the scheduler
     * @param {string} actionName action name
     * @param {actionListner} fn callback function
     * @public
     */
    action: (actionName: string, fn: actionListner) => void;
}