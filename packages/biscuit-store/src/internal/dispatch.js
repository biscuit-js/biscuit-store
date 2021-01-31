import { repositories } from './repositories';
import { activeMiddlewares, getStateRepo } from './helper';
import { emitter } from './emitter';

export function dispatchProto({ action, prev, act, payData }) {
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
            ...act,
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

export async function dispatchInitMiddleware({ action, payData, act }) {
    return await new Promise((resolve) => {
        activeMiddlewares(
            {
                action: action.state,
                repo: action.repo,
                payload: payData,
                state: act,
            },
            (newPayload) => {
                resolve(newPayload);
            }
        );
    });
}