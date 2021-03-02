import {
    repositories,
} from './repositories';
import {
    emitter,
} from './emitter';
import {
    gettter,
    getStateLink,
    getStoreContent,
    compareObject,
    actionError,
    getStoreName,
} from './helper';
import { dispatchProto, dispatchInitMiddleware } from './dispatch';
import { CreateError } from './debugger';
import { typeOf } from './utils';
import { messages } from './messages';
/**
 * Allows you to subscribe to the store. and tracks its change.
 * @param {string} name store name
 * @param {function} fn callback
 * @param {string} type state name
 * @return {Promise}
 * @async
 */
const subscriber = function (name, fn, type) {
    let task;
    const promise = new Promise((resolve) => {
        task = emitter.subscribeAction(name, () => {
            /** if there is a state then pick it up */
            const data = type
                ? getState({ name, type })
                : getStore(name);
            fn(data, task);
            resolve({ data });
        }, type);
    });

    const resolve = this.resolve(promise);
    resolve['unsubscribe'] = task.remove;

    return resolve;
};

/**
 * This method allows you to add new values to the store.
 * Accepts the storage name and object.
 * @param {string | import('../../../types').Store} target store name or store
 * @param {object} instance object with added data
 * @public
 */
export function addStore(target, instance) {
    const name = getStoreName(target);
    if (!repositories[name]) {
        throw new CreateError(messages.noStore(name));
    }

    if (typeOf(instance) !== 'object') {
        throw new CreateError(messages.initialType);
    }

    repositories[name].content = {
        ...getStoreContent(name),
        ...instance,
    };
}

/**
 * This method is used to get data from the storage by its key.
 * Warning: Storage data cannot be changed directly.
 * You can replace the values either with the "addStore"
 * method or with state injection via "manager".
 * @param {string | import('../../../types').Store} target store name or store
 * @return {object} storage data
 * @public
 */
export function getStore(target) {
    const name = getStoreName(target);

    if (!repositories[name]) {
        throw new CreateError(messages.noStore(name));
    }

    return gettter({ ...getStoreContent(name) });
}

/**
 * This method is needed to get the storage state
 * Warning: Storage data cannot be changed directly.
 * You can replace the values either with the "dispatch (...)"
 * method or with an implementation via "manager".
 * @param {import('../../types/state').AnyAction} action the parameters of the action
 * @return {object} state data
 * @public
 */
export function getState(action) {
    actionError(action);
    return gettter({ ...getStateLink(action).content });
}

/**
 * This is one of the most important methods.
 * allows you to asynchronously update and change the state of the storage.
 *
 * The first argument accepts action parameters,
 * the second argument accepts an object with new data
 * or a callback function that returns the past state
 * as an argument and returns a new state.
 *
 * Dispatch also returns several methods for working with states.
 * @param {import('../../types/state').AnyAction} action the parameters of the action
 * @param {object | import('../../types/state').DispatchPayload} payload
 * payload data or callback function
 * @return {import('../../types/state').Dispatcher}
 * returns methods: before, after, merge
 * @async
 * @public
 */
export function dispatch(action, payload = {}) {
    const voids = {};

    actionError(action);

    if (typeOf(payload) !== 'function' && typeOf(payload) !== 'object') {
        throw new CreateError('The payload must be an object or function.', action.name);
    }

    async function promise() {
        const state = getStateLink(action);
        const prev = { ...state.content };

        /** if the function
         * then pass the current state to the callback  */
        let payData = typeof payload === 'function'
            ? payload(prev)
            : payload;

        dispatchProto.call(voids, {
            action,
            prev,
            payData,
        });

        /** initial middlewares */
        payData = await dispatchInitMiddleware({ action, payData, prev });

        /** update state data */
        getStateLink(action).content = {
            ...state.content,
            ...payData,
        };

        /** create dispatch action */
        emitter.dispatchAction(action);
        return true;
    };

    const task = promise();

    return { wait: task, ...voids };
}

/**
 * This is one of the most important methods.
 * Allows you to subscribe to the state. and tracks its change.
 * The first argument takes the parameters of the action.
 * results can be obtained through the callback of the second
 * argument or through the return promise.
 * @param {import('../../types/state').AnyAction} action the parameters of the action
 * @param {import('../../types/subscribe').SubscribeListner} fn callback
 * @return {Promise<any>}
 * @async
 * @public
 */
export function subscribeToState(action, fn = () => undefined) {
    const that = Promise;
    try {
        actionError(action);
        return subscriber.call(that, action.name, fn, action.type);
    } catch (e) {
        return that.reject(e);
    }
}

/**
 * This is one of the most important methods.
 * Allows you to subscribe to the store. and tracks its change.
 * The first argument takes the name store.
 * results can be obtained through the callback of the
 * second argument or through the return promise.
 * @param {string | import('../../../types').Store} target store name or store
 * @param {import('../../types/state').SubscribeListner} fn callback
 * @callback
 * @async
 * @public
 */
export function subscribeToStore(target, fn = () => undefined) {
    const storeName = getStoreName(target);
    const that = Promise;
    try {
        if (!repositories[storeName]) {
            throw new CreateError(messages.noStore(storeName));
        }

        return subscriber.call(that, storeName, fn);
    } catch (e) {
        return that.reject(e);
    }
}
