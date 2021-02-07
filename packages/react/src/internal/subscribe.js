import React from 'react';
import { dispatch } from '@biscuit-store/core';
import { emitter } from '@biscuit-store/core/src/utils';

/**
 * subscriber react components
 * @param {function} stateToProps props list
 * @param {object} dispatchToProps dispatch list
 * @return {import("react").ReactElement}
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
                };
            };

            /** mount update event */
            componentDidMount() {
                const result = {};
                for (let param in dispatchToProps) {
                    const repoName = dispatchToProps[param].repo;
                    const task = emitter.subscribeAction(repoName, () => {
                        this.forceUpdate();
                    });

                    result[param] = (payload) => dispatch(dispatchToProps[param], payload);
                    this.buf.push(task);
                }

                this.setState({ dispatchers: result });
            };

            /** unmount update event */
            componentWillUnmount() {
                for (let task in this.buf) {
                    task.remove();
                }
            };

            /** proxy element */
            render() {
                return (
                    <Element
                        {...this.props}
                        {...stateToProps()}
                        {...this.state.dispatchers || {}}
                    />
                );
            };
        };
    };
};