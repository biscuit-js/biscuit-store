export type ReactComponent<P = any> =
	| React.ClassicComponentClass<P>
	| React.ComponentClass<P>
	| React.FunctionComponent<P>
	| React.ForwardRefExoticComponent<P>;
