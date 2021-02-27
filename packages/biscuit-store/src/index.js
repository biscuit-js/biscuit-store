import { createLog, CreateError, Warning } from './internal/debugger';
import { emitter } from './internal/emitter';
import { throttle, debounce, sandbox } from './internal/utils';


export {
    createStore,
    newStore,
    createActionTo,
    initialActions,
    stateCollection,
    combineStateCollections,
    middleware,
    createDebuger,
} from './internal/creator';

export {
    createManager,
    dispatch,
    getStore,
    getState,
    addStore,
    subscribeToState,
    subscribeToStore,
} from './internal/store';

export const utils = {
    createLog,
    CreateError,
    Warning,
    emitter,
    throttle,
    debounce,
    sandbox,
};
