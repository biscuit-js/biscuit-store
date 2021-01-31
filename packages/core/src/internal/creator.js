import { debugCollection, CreateError } from './debugger';
import {
    repositories,
    states,
    middlewares,
    settings,
} from './repositories';

import {
    dispatch,
    subscribeToState,
    getState,
    getRepo,
    subscribeToStore,
    addRepo,
} from './store';
import { type } from './utils';
import { actionError } from './helper';
import { messages } from './messages';

/**
 * This method is responsible for creating a new repository.
 * Takes as the first argument a string with the repository name.
 * and the initial state of the storage as the second argument
 * @param {string} name storage name
 * @param {import('../types/store').Store} initial initial object
 * @public
 */
export function newRepo(name, initial = {}) {
    if (!name) {
        throw new CreateError(messages.noRepoName);
    }

    if (repositories[name]) {
        throw new CreateError(messages.repoExists);
    }

    if (typeof name !== 'string') {
        throw new CreateError(messages.storageNameError('newRepo'));
    }

    if (type(initial) !== 'object') {
        throw new CreateError(messages.initialType, name);
    }

    repositories[name] = { content: initial };

    return {
        repo: name,
        /** Subscribe by change @param {function} fn */
        subscribe: (fn) => subscribeToStore(name, fn),
        /** get reposiory */
        get: () => getRepo(name),
        /** add to reposiory @param {object} instance */
        add: (instance) => addRepo(name, instance),
    };
}

/**
 * This method binds states to the storage via the "add" method.
 * Gets the storage name string as an argument.
 * @param {import('../types/store').Store} params name of the linked storage
 * @return {import('../types/state').ActionCreator} returns the "add" method
 * @public
 */
export function createStateTo(params) {
    if (!repositories[params.repo]) {
        throw new CreateError(messages.repoNotFind);
    }

    const createNewState = (stns) => {
        if (!stns.branch) {
            return repositories[params.repo];
        }

        return {
            content: {
                ...repositories[params.repo].content,
                ...stns.initial,
            },
        };
    };

    return {
        /** This method binds the state to the selected storagee
		 * @param {string} action state name
         * @param {import('../types/state').StateOptions} options state options
         * @return {import('../types/state').StateAction}
		 * @public
		 */
        bind: (action, options = { branch: false, initial: {} }) => {
            if (typeof action !== 'string') {
                throw new CreateError(messages.actionString, params.repo);
            }

            const actionStr = `"${action}"`;

            states[actionStr] = {
                ...states[actionStr],
                [params.repo]: createNewState(options),
            };

            const actionParams = {
                repo: params.repo,
                state: action,
            };

            return {
                ...actionParams,
                /**
				 * Update state
				 * @param {import('../types/state').DispatchPayload} payload
				 * @public
				 */
                dispatch: (payload = {}) => dispatch(actionParams, payload),
                /**
				 * Subscribe to state
				 * @param {import('../types/subscribe').SubscribeListner} fn callback
				 * @public
				 */
                subscribe: (fn) => subscribeToState(actionParams, fn),

                /**
				 * Get state
				 * @public
				 */
                getState: () => getState(actionParams),
            };
        },
        /** repository key */
        repo: params.repo,
    };
}

/**
 * This helper method takes the first parameter "createactionsTo"
 * and adds actions to it from the string array of the second argument.
 * @param {import('../types/state').ActionCreator} createActions
 * createactionsto(storage name) method
 * @param {array[string]} actions actions string array
 * @return {{import('../types/state').StateAction}[]} actions
 * @public
 */
export function initialActions(createActions, actions) {
    return actions.map((item) => {
        const args = typeof item === 'string'
            ? [item]
            : [item.name, item.options];

        return createActions.bind.apply(null, args);
    });
}

/**
 * This helper method converts the actions received via the argument to an array
 * @return {import('../types/state').StateCollection} returns the "compile" method
 * @public
 */
export function stateCollection() {
    const collection = {};
    return {
        /**
		 * compile state collection
		 * @return {import('../types/state').StateCollectionRepo} actions collection
		 * @public
		 */
        compile: (...actions) => {
            for (let action of actions) {
                actionError(action);

                if (!collection[action.repo]) {
                    collection[action.repo] = [{ ...action }];
                    continue;
                }

                collection[action.repo].push({ ...action });

            }

            return { ...collection };
        },
        /**
         * Get the entire collection actions
         * @return {import('../types/state').StateCollectionRepo} collections instance
         * @public
         */
        all: () => ({ ...collection }),

        /**
         * Get a collection by matching the storage name
         * @param {string} repo storage name
         * @return {import('../types/state').StateAction[]} collections instance
         * @public
         */
        fromRepo: (repo) => [ ...collection[repo] ],

        /**
         * Get the result filtered by state name
         * @param {string} stateName state name
         * @return {import('../types/state').StateAction[]} state list
         * @public
         */
        outOfState: (stateName) => {
            let out = null;
            Object.keys(collection).forEach((key) => {
                out = collection[key].filter(({ state }) => state === stateName);
            });

            return out;
        },
    };
}

/**
 * This helper method can combine multiple collections of actions.
 * Accepts "stateCollection(...action)"
 * @param {import('../types/state').StateCollection} collection array StateCollection
 * @public
 */
export function combineStateCollections(...collections) {
    let allState = [];
    for (let collection of collections) {
        Object.keys(collection.all()).forEach((repoName) => {
            allState = [ ...allState, ...collection.fromRepo(repoName) ];
        });
    }

    const sc = stateCollection();
    sc.compile.apply(null, allState);
    return sc;
}

/**
 * This method allows you to add middleware for the state handler.
 * @param {import('../types/store').Store} store the store params
 * @return {import('../types/store').MiddlewareParams} returns a set of methods
 * @public
 */
export function middleware(store) {
    if (!repositories[store.repo]) {
        throw new CreateError(messages.noRepo(store.repo));
    }

    const s = store.repo;
    return {
        /**
		 * Adds a handler to the middleware task list.
		 * @param {function} fn middle function
		 * @public
		 */
        add: (fn) => {
            if (typeof fn !== 'function') {
                throw new CreateError(messages.middleNoFunc, s);
            }

            if (middlewares[s]) {
                middlewares[s].push(fn);
            } else {
                middlewares[s] = [fn];
            }
        },
    };
}

/**
 * This method allows you to add your own debugger.
 * The debugger will accept and output logs instead of the standard debugger.
 * @param {import('../types/store').Store} store store object
 * @param {import('../types/store').DebuggerListener} fn debugger callback function
 * @public
 */
export function createDebuger(store, fn) {
    if (!repositories[store.repo]) {
        throw new CreateError(messages.noRepo(store.repo));
    }

    if (typeof fn !== 'function') {
        throw new CreateError(messages.debuggerNoFunc);
    }

    debugCollection[store.repo] = fn;
}

/**
 * Monolithic method for creating a biscuit storage.
 * This is the preferred method for creating a repository.
 * @param {import('../types/store').StoreSettings} options
 * an object containing the store settings
 * @return {import('../types/store').StoreParams}
 * returns a set of actions
 * @public
 */
export function createStore(options) {
    if (!options) {
        throw new CreateError(messages.noStoreParams);
    }

    /** DefaultParams */
    const params = { strictMode: true, ...options };

    /** Create a new storage */
    const repo = newRepo(params.repo.name, params.repo.initial);
    const createAction = createStateTo(repo);

    /** Set of storage parameters */
    const output = {
        store: { ...repo },
        actions: {},
    };

    /** Adding States to the repository */
    if (params.states) {
        for (const key in params.states) {
            const param = params.states[key];
            const paramType = typeof param === 'string';
            output.actions[key] = createAction.bind(
                paramType ? param : param.name,
                paramType
                    ? {}
                    : { initial: param.initial, branch: param.branch }
            );
        }
    }

    /** Adding middleware to the repository */
    if (params.middleware && params.middleware.length > 0) {
        const middle = middleware(repo);
        for (const fn of params.middleware) {
            middle.add(fn);
        }
    }

    /** Adding debuger to the repository */
    if (params.debugger) {
        createDebuger(repo, params.debugger);
    }

    /** Strict mod */
    settings.strictMode[params.repo.name] = params.strictMode;

    return output;
}