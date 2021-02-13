import React, { memo, useEffect, useState } from 'react';
import { getRepo, getState } from '@biscuit-store/core';
import { CreateError, emitter } from '@biscuit-store/core/src/utils';

/** Get state or repository data */
const getData = (repo, state) => {
    if (state) {
        return getState({ repo, state });
    }

    return getRepo(repo);
};

/** Collects source data from dependent stores */
const loopDeps = (deps, res) => {
    if (!deps.length) {
        throw new CreateError('The observer must have dependencies.');
    }
    let result = res;
    for (let dep of deps) {
        result = { ...result, ...getData(dep.repo, dep.state) };
    }
    return result;
};

/**
 * ### Observer
 * The observer for the states of a component
 * Allows you to subscribe a component to one or more store states.
 * Makes an update when the state changes and forwards the changed data.
 * @param {import('../../types/component').ReactComponent} Element react element
 * @param {import('../../types/interfaces').Deps} deps dependence on the state
 * @return {import('../../types/component').ReactComponent}
 * @public
 */
export function observer(Element, deps) {
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
                initial = { ...initial, ...getData(e.name, e.state) };
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