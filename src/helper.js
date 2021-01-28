import {
    middlewares,
    states,
    repositories,
} from "./repositories";

export function getStateRepo(action) {
    return states[`"${action.state}"`][action.repo]
}

export function getRepository(name) {
    return repositories[name].content
}

/**
 * Helper method for running middleware
 * @param {object} context handler context
 * @param {function} fn callback
 * @async
 * @private
 */
export async function activeMiddlewares(context, fn = () => null) {
    if (middlewares[context.repo]) {
        await middlewares[context.repo].forEach((middle) => {
            middle(context, fn);
        });
    } else {
        fn(context.payload);
    }
}

/**
 * This method is used to get the values of the object without the possibility of overwriting. 
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
 * @param {object} firstState first object
 * @param {object} lastState last object
 * @return {bool}
 * @private
 */
export function compareObject(firstState, lastState) {
    let propInFirst = 0;
    let propInLast = 0;
    let prop;

    if (firstState === lastState) {
        return true;
    }

    if (
        firstState == null ||
    typeof firstState !== "object" ||
    lastState == null ||
    typeof lastState !== "object"
    ) {
        return false;
    }

    for (prop in firstState) {
        propInFirst += 1;
    }

    for (prop in lastState) {
        propInLast += 1;

        if (
            !(prop in firstState) ||
      !compareObject(firstState[prop], lastState[prop])
        ) {
            return false;
        }
    }

    return propInFirst === propInLast;
}