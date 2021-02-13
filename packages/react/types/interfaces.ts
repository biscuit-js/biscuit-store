import { StateAction, StaticAction, Store } from '@biscuit-store/types';

export interface DispatchToProps {
    [propName: string]: (StateAction | StaticAction);
}

export type StateToProps<S, P> = (state: S) => P;

export type Deps = Array<StateAction | Store | StaticAction>;
