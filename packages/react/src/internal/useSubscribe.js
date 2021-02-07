import { useEffect, useRef, useState } from 'react';
import { emitter } from '@biscuit-store/core/src/utils';
import { getState, dispatch } from '@biscuit-store/core';

/**
 * huck subscribe repository state
 * @param {object} action state params
 * @param {boolean} update if false excludes update
 * @return {object}  repository state
 * @public
 */

export function useSubscribe(action, update = true) {
    const [state, setState] = useState(null);
    let value = useRef(getState(action));

    useEffect(() => {
        let cache = {};

        const task = emitter.subscribeAction(action.repo, (data) => {
            const n = data;

            if (update) {
                setState(data);
                return;
            }

            if (!(n in cache)) {
                setState(null);
            }

            cache[n] = data;
            value.current = cache[n];
        });

        return () => task.remove();
    }, [action, update]);

    return [
        state || value.current, (payload) =>
            dispatch(action, payload),
    ];
}