import { useEffect, useRef, useState } from 'react';
import { emitter } from '@biscuit-store/core/src/utils';
import { dispatch } from '@biscuit-store/core';
import { getData } from './utils';

/**
 * ### useSubscribe
 * This hook subscribes to the state or storage.
 * @param {import('../../../types').StateAction} action state params
 * @param {boolean} update if false excludes update
 * @return returns the status object and the dispatcher
 * @public
 */
export function useSubscribe(action, update = true) {
    const [state, setState] = useState(null);
    /** Get default state */
    const setCurrentData = () =>
        getData(action.repo, action.state);
    let value = useRef(setCurrentData());

    useEffect(() => {
        let cache = {};

        /** Subscribe store or state */
        const task = emitter.subscribeAction(action.repo, () => {
            const n = setCurrentData();
            /** Update the state if the update parameter is true */
            if (update) {
                setState(n);
                return;
            }
            /** Check cache */
            if (!(n in cache)) {
                setState(null);
            }
            /** Write data */
            cache[n] = n;
            value.current = cache[n];
        }, action.state);

        /** Unsubscribe */
        return () => task.remove();
    }, [action, update]);

    return [
        state || value.current, (payload) =>
            dispatch(action, payload),
    ];
}