import { middlewares, states, repositories } from './repositories';
import { CreateError } from './debugger';
import { messages } from './messages';

/**
* Get store link
* @param {string} name
*/
export function getStateLink(action) {
    return states[`"${action.type}"`][action.name];
}

/**
* Get store content
* @param {string} name
*/
export function getStoreContent(name) {
    return repositories[name].content;
}

/**
* Get store actions
* @param {string} name
*/
export function getStoreContentActions(name) {
    return repositories[name].actions;
}

/**
* To obtain the name of the store depending on the type of
* @param {object | string} target
*/
export function getStoreName(target) {
    if (typeof target === 'string') {
        return target;
    }

    return target.name;
}

/**
* Validating an action
* @param {import('../../types/state').AnyAction} action
*/
export const actionError = (action) => {
    if (!action || !action.name || !action.type) {
        throw new CreateError('Invalid action parameters.');
    }

    if (!repositories[action.name]) {
        throw new CreateError(messages.noStore(action.name));
    }

    if (!states[`"${action.type}"`]) {
        throw new CreateError(messages.noState(action.type), action.name);
    }
};

/**
 * Helper method for running middleware
 * @param {object} context handler context
 * @param {function} fn callback
 * @async
 * @private
 */
export async function activeMiddlewares(context, fn = () => null) {
    if (middlewares[context.store]) {
        await middlewares[context.store].forEach((middle) => {
            middle(context, fn);
        });
    } else {
        fn(context.payload);
    }
}

/**
 * This method is used to get the values of the object without
 * the possibility of overwriting.
 * by attempting to write generates an error.
 * @param {object} instance object to extract
 * @return {object} returns a modified copy of the object
 * @private
 */
export function gettter(instance) {
    return Object.freeze({ ...instance });
}

/**
 * Helper method for comparing two objects
 * Warning: can't compare methods
 * @param {object} first first object
 * @param {object} last last object
 * @return {bool}
 * @private
 */
export function compareObject(first, last) {
    if (first === last) {
        return true;
    }

    if (first === null || typeof first !== 'object' || last === null && typeof last !== 'object') {
        return false;
    }

    if (Object.keys(first).length !== Object.keys(last).length) {
        return false;
    }

    let equal = true;
    for (let key in first) {
        if (typeof first[key] === 'object' && typeof last[key] === 'object') {
            if (!compareObject(first[key], last[key])) {
                equal = false;
            }
        } else if (typeof first[key] === 'function' && typeof last[key] === 'function') {
            if (first.toString() !== last.toString()) {
                equal = false;
            }
        } else if (first[key] !== last[key]) {
            equal = false;
        }
    }

    return equal;
}
