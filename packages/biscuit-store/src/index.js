import { createLog, CreateError, Warning } from './internal/debugger';
import { emitter } from './internal/emitter';
import { throttle, debounce, sandbox } from './internal/utils';


export {
    createStore,
    newRepo,
    createStateTo,
    initialActions,
    stateCollection,
    combineStateCollections,
    middleware,
    createDebuger,
} from './internal/creator';

export {
    createManager,
    dispatch,
    getRepo,
    getState,
    addRepo,
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
}
