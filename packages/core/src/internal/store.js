/**
 * BISCUIT STORAGE
 * @autor: Zhulev Philipp
 * @version: 1.0.0
 * @license MIT
 */
import {
    repositories,
    states,
} from './repositories';
import {
    emitter,
} from './emitter';
import {
    gettter,
    getStateRepo,
    getRepository,
    compareObject,
    actionError,
} from './helper';
import { dispatchProto, dispatchInitMiddleware } from './dispatch';
import { CreateError } from './debugger';
import { type } from './utils';
import { messages } from './messages';

/**
 * Allows you to subscribe to the store. and tracks its change.
 * @param {string} repo repository name
 * @param {function} fn callback
 * @param {string} state state name
 * @return {Promise}
 * @async
 */
const subscriber = function (repo, fn, state) {
    let task;
    const promise = new Promise((resolve) => {
        task = emitter.subscribeAction(repo, () => {
            /** if there is a state then pick it up */
            const data = state
                ? getState({ repo, state })
                : getRepo(repo);
            fn(data, task);
            resolve({ data });
        }, state);
    });

    const resolve = this.resolve(promise);
    resolve['unsubscribe'] = task.remove;

    return resolve;
};

/**
 * This method allows you to add new values to the repository.
 * Accepts the storage name and object.
 * @param {string} name repository name
 * @param {object} instance object with added data
 * @public
 */
export function addRepo(name, instance) {
    if (!repositories[name]) {
        throw new CreateError(messages.noRepo(name));
    }

    if (type(instance) !== 'object') {
        throw new CreateError(messages.initialType);
    }

    repositories[name].content = {
        ...getRepository(name),
        ...instance,
    };
}

/**
 * This method is used to get data from the storage by its key.
 * Warning: Storage data cannot be changed directly.
 * You can replace the values either with the "addRepo"
 * method or with state injection via "manager".
 * @param {string} name storage name
 * @return {object} storage data
 * @public
 */
export function getRepo(name) {
    if (!repositories[name]) {
        throw new CreateError(messages.noRepo(name));
    }

    return gettter({ ...getRepository(name) });
}

/**
 * This method is needed to get the storage state
 * Warning: Storage data cannot be changed directly.
 * You can replace the values either with the "dispatch (...)"
 * method or with an implementation via "manager".
 * @param {import('../types/state').StateAction} action the parameters of the action
 * @return {object} state data
 * @public
 */
export function getState(action) {
    actionError(action);
    return gettter({ ...getStateRepo(action).content });
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
 * @param {import('../types/state').StateAction} action the parameters of the action
 * @param {object | import('../types/state').DispatchPayload} payload
 * payload data or callback function
 * @return {import('../types/state').Dispatcher}
 * returns methods: before, after, merge
 * @async
 * @public
 */
export function dispatch(action, payload = {}) {
    const voids = {};

    actionError(action);

    if (type(payload) !== 'function' && type(payload) !== 'object') {
        throw new CreateError('The payload must be an object or function.', action.repo);
    }

    (async function () {
        const act = getStateRepo(action).content;
        const prev = { ...act };

        /** if the function
         * then pass the current state to the callback  */
        let payData = typeof payload === 'function'
            ? payload(prev)
            : payload;

        dispatchProto.call(voids, {
            action,
            prev,
            act,
            payData,
        });

        /** initial middlewares */
        payData = await dispatchInitMiddleware({ action, payData, act });

        /** update state data */
        getStateRepo(action).content = {
            ...act,
            ...payData,
        };

        /** create dispatch action */
        emitter.dispatchAction(action);
    })();

    return voids;
}

/**
 * This is one of the most important methods.
 * Allows you to subscribe to the state. and tracks its change.
 * The first argument takes the parameters of the action.
 * results can be obtained through the callback of the second
 * argument or through the return promise.
 * @param {import('../types/state').StateAction} action the parameters of the action
 * @param {import('../types/subscribe').SubscribeListner} fn callback
 * @return {Promise<any>}
 * @async
 * @public
 */
export function subscribeToState(action, fn = () => undefined) {
    const that = Promise;
    try {
        actionError(action);
        return subscriber.call(that, action.repo, fn, action.state);
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
 * @param {string} repo repository name
 * @param {import('../types/state').SubscribeListner} fn callback
 * @callback
 * @async
 * @public
 */
export function subscribeToStore(repo, fn = () => undefined) {
    const that = Promise;
    try {
        if (!repositories[repo]) {
            throw new CreateError(messages.noRepo(repo));
        }

        return subscriber.call(that, repo, fn);
    } catch (e) {
        return that.reject(e);
    }
}

/**
 * The State Manager allows you to manage the storage and its state.
 * Provides a set of methods for two-way merge, replace, copy,
 * and other actions between the selected storage and state.
 * @param {object{repo: string, state: string}} action the parameters of the action
 * @return {object} returns a set of methods
 * @public
 */
export function manager(action) {
    actionError(action);
    return {
        /**
         * This method will combine data from the state with data from the storage.
         * @public
         */
        merge: () => {
            repositories[action.repo].content = {
                ...getRepository(action.repo),
                ...getStateRepo(action).content,
            };
        },

        /**
         * This method will merge data from the storage with data from the state.
         * @public
         */
        pull: () => {
            getStateRepo(action).content = {
                ...getStateRepo(action).content,
                ...getRepository(action.repo),
            };
        },

        /**
         * This method will replace the data from the storage with state data.
         * @public
         */
        replaceRepo: () => {
            repositories[action.repo].content = {
                ...getStateRepo(action).content,
            };
        },

        /**
         * This method will replace the data from the state with the storage data.
         * @public
         */
        replaceState: () => {
            getStateRepo(action).content = {
                ...getRepository(action.repo),
            };
        },

        /**
         * This method will merge the data of the selected state
         * with the data of the state specified in the arguments.
         * @param {import('../types/state').StateAction} targetAction
         * the action that you want to merge
         * @public
         */
        mergeState: (targetAction) => {
            actionError(targetAction);
            getStateRepo(action).content = {
                ...getStateRepo({
                    state: targetAction.state,
                    repo: action.repo,
                }).content,
                ...getStateRepo(action).content,
            };
        },

        /**
         * This method removes the storage and its copies from all states.
         * WARNING: This method can be useful for optimization,
         * but it can make the code non-obvious,
         * which will lead to difficulties in support.
         * @public
         */
        remove: () => {
            delete repositories[action.repo];
            Object.keys(states[`"${action.state}"`]).forEach((item) => {
                if (item === action.repo) {
                    delete states[`"${action.state}"`][action.repo];
                }
            });
        },

        /**
         * This method compares two states for identity
         * WARNING: states should not contain methods
         * @param {import('../types/state').StateAction} targetAction
         * the action that you want to compare
         * @return {bool}
         * @public
         */
        compareStates: (targetAction) => {
            actionError(targetAction);
            return compareObject(
                getStateRepo(action).content,
                ...getStateRepo({
                    state: targetAction.state,
                    repo: action.repo,
                }).content,
            );
        },

        /**
         * Сompare state and repository
         * WARNING: states should not contain methods
         * @return {bool}
         * @public
         */
        compareWithState: () => {
            return compareObject(
                getRepository(action.repo),
                getStateRepo(action).content
            );
        },

        /**
         * compare state and instance object
         * WARNING: states should not contain methods
         * @param {object} instance object instance
         * @return {bool}
         * @public
         */
        compareStateWithInstance: (instance) => {
            return compareObject(getStateRepo(action).content, instance);
        },

        /**
         * compare repository and instance object
         * WARNING: states should not contain methods
         * @param {object} instance object instance
         * @return {bool}
         * @public
         */
        compareRepoWithInstance: (instance) => {
            return compareObject(getRepository(action.repo), instance);
        },

        /**
         * Clones the selected storage and its state.
         * WARNING: It is best to avoid using this method,
         * as the best practice would be to do initialization of repositories in one place.
         * Copying the repository can lead to code support difficulties.
         * @param {string} name name for the new storage
         * @public
         */
        clone: (name) => {
            repositories[name] = { content: { ...getRepository(action.repo) } };
            states[`"${action.state}"`][name] = {
                content: { ...getStateRepo(action).content },
            };
        },

        /**
         * Updates the status of the repository.
         * This method is equivalent to dispatch(...)
         * @public
         */
        update: () => {
            dispatch(action, {});
        },

        /**
         * Returns parameters of the selected action
         * @public
         */
        props: action,
    };
}
