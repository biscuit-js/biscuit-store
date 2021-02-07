import { repositories } from './repositories';
import { activeMiddlewares, getStateRepo, getRepositoryActions } from './helper';
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
	 * Merge state into repository
	 * @public
	 */
    this.merge = () => {
        repositories[action.repo].content = {
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
                action.repo,
                () => call(resolve),
                action.state
            );
        }).then(fn);
        return this;
    };
}

export async function dispatchInitMiddleware({ action, payData, prev }) {
    const actions = getRepositoryActions(action.repo);
    return await new Promise((resolve) => {
        activeMiddlewares(
            {
                action: action.state,
                repo: action.repo,
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