import {
    Adapter,
    AdapterActionCtx,
    GetAction,
    Send,
    ActionListner,
} from './adapter';

/**
 * This is a feature for creating middleware for the biscuit-store.
 * Allows you to create a manageable condition.
*/
export function createAdapter(): Adapter;

export {
    AdapterActionCtx,
    GetAction,
    Send,
    ActionListner,
};