import { repositories } from './repositories';
import { activeMiddlewares, getStateRepo, getStoresitoryActions } from './helper';
import { emitter } from './emitter';
export function dispatchProto({ action, prev, payData }) {
    /**
	 * Call before state change
	 * @param {function} fn callback
	 * @public
	 */
    this.before = (fn) => {
        fn(prev);
        return this;
    };

    /**
	 * Merge state into store
	 * @public
	 */
    this.merge = () => {
        repositories[action.name].content = {
            ...prev,
            ...payData,
        };

        return this;
    };

    /**
	 * Call after state change
	 * @param {function} fn callback
	 * @async
	 * @public
	 */
    this.after = async (fn) => {
        let task;
        const call = function (resolve) {
            resolve({
                ...getStateRepo(action).content,
            });
            task.remove();
        };

        await new Promise((resolve) => {
            task = emitter.subscribeAction(
                action.name,
                () => call(resolve),
                action.type
            );
        }).then(fn);
        return this;
    };
}

export async function dispatchInitMiddleware({ action, payData, prev }) {
    const actions = getStoresitoryActions(action.name);
    return await new Promise((resolve) => {
        activeMiddlewares(
            {
                action: action.type,
                store: action.name,
                payload: payData,
                state: prev,
                getAction: (actionName) => actions[`"${actionName}"`],
            },
            (newPayload) => {
                resolve(newPayload || payData);
            }
        );
    });
}