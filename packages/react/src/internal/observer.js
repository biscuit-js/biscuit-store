import React, { memo, useEffect, useState } from 'react';
import { getRepo } from '@biscuit-store/core';
import { CreateError, emitter } from '@biscuit-store/core/src/utils';

/** Collects source data from dependent stores */
const loopDeps = (deps, res) => {
    let result = res;
    for (let dep of deps) {
        if (!deps.length) {
            throw new CreateError('The observer must have dependencies.');
        }
        result = { ...result, ...getRepo(dep.repo) };
    }
    return result;
};

/**
 * The observer for the states of a component
 * ---
 * Allows you to subscribe a component to one or more store states.
 * Makes an update when the state changes and forwards the changed data.
 * @param {import("react").ReactElement} Element react element
 * @param {array} deps dependence on the state
 * @return {import("react").ReactElement}
 * @public
 */
export function observer(Element, deps = []) {
    let initial = {};
    let task;

    /** Create decorator */
    const Decorator = (props) => {
        const [state, setState] = useState(() => {
            initial = loopDeps(deps, initial);
            return initial;
        });


        useEffect(() => {
            if (!deps.length) {
                throw new CreateError('The observer must have dependencies.');
            }

            /** Creating a subscription to the store state */
            task = emitter.subscribeActions(deps.map((dep) => dep), (e) => {
                initial = { ...initial, ...getRepo(e.name) };
                /** Trigger an update */
                setState((prev) => ({ ...prev, ...initial }));
            });

            /** Unsubscribe when the component is unmounted */
            return () => task.remove();
        }, []);

        return <Element {...props} {...state} />;
    };

    /** Memoization decorator */
    return memo(Decorator);
}