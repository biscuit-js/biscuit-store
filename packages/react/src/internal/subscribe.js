import React from 'react';
import { dispatch, getState } from '@biscuit-store/core';
import { utils } from '@biscuit-store/core';
const { emitter } = utils;

/**
 * ### Subscribe
 * Allows you to bind a set of actions and dispatchers
 * to a component, updates the component, and retrieves data.
 * @param {import('../../types/interfaces').StateToProps} stateToProps props list
 * @param {import('../../types/interfaces').DispatchToProps} dispatchToProps dispatch list
 * @return {import('../../types/component').ReactComponent}
 * @public
 */
export function subscribe(stateToProps, dispatchToProps) {
    return (Element) => {
        return class extends React.Component {
            buf = [];

            constructor(props) {
                super(props);
                this.state = {
                    dispatchers: {},
                    data: null,
                };
            };

            /** mount update event */
            componentDidMount() {
                const dispatchers = {};
                const states = {};
                for (let param in dispatchToProps) {
                    const repoName = dispatchToProps[param].repo;
                    const action = dispatchToProps[param];
                    const task = emitter.subscribeAction(repoName, () => {
                        this.setState({
                            data: {
                                ...this.state.data,
                                [repoName]: getState(action),
                            },
                        });
                    });

                    dispatchers[param] = (payload) => dispatch(action, payload);
                    states[repoName] = getState(action);
                    this.buf.push(task);
                }

                this.setState({ dispatchers, data: states });
            };

            /** unmount update event */
            componentWillUnmount() {
                for (let task in this.buf) {
                    task.remove();
                }
            };

            /** proxy element */
            render() {
                return this.state.data ? <Element
                    {...this.props}
                    {...stateToProps(this.state.data)}
                    {...this.state.dispatchers || {}}
                /> : null;
            };
        };
    };
};