import { StateAction, StaticAction, Store } from '@biscuit-store/types';

export interface DispatchToProps {
	[propName: string]: StateAction | StaticAction;
}

export type StateToProps<S, P> = (state: S) => P;

export type Deps = Array<StateAction | Store | StaticAction>;
export type Dep = StateAction | Store | StaticAction;
export type DepsAction = Array<StateAction | StaticAction>;

export type ModifyDispatch = <T>(payload: T) => void;
