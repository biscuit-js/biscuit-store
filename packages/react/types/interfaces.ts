import { StateAction, StaticAction, Store } from '@biscuit-store/types';
import { ReactComponent } from './component';

export interface DispatchToProps<S = any> {
	[propName: string]: StateAction<S> | StaticAction;
}

export type StateToProps<S, P> = (state: S) => P;

export type Deps<S> = Array<StateAction<S> | Store<S> | StaticAction>;
export type Dep<S> = StateAction<S> | Store | StaticAction;
export type DepsAction<S> = Array<StateAction<S> | StaticAction>;

export type ModifyDispatch = <T>(payload: T) => void;

export type ListenMethod<P> = (
	Component: ReactComponent<P>
) => ReactComponent<P>;

export type ListenReplace<P> = (
	Component: ReactComponent<P>,
	NewComponent: ReactComponent<P>
) => ReactComponent<P>;
