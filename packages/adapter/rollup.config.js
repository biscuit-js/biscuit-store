
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

const extensions = ['.js'];

import pkg from './package.json';

const makeExternalPredicate = (externalArr) => {
	if (externalArr.length === 0) {
		return () => false;
	}
	const pattern = new RegExp(`^(${externalArr.join('|')})($|/)`);
	return (id) => pattern.test(id);
};

const external = makeExternalPredicate([
	...Object.keys(pkg.dependencies || {}),
	...Object.keys(pkg.peerDependencies || {}),
]);

const makePlugins = (useESModules) => {
	return [
		commonjs(),
		nodeResolve({
			extensions,
		}),
		babel({
			extensions,
			plugins: [['@babel/plugin-transform-runtime', { useESModules }]],
			babelHelpers: 'runtime',
		}),
	];
};

const inputName = 'src/index.js';

export default [
	{
		input: inputName,
		output: { file: 'lib/index.js', format: 'cjs', indent: false },
		external,
		plugins: makePlugins(false),
	},

	{
		input: inputName,
		output: { file: 'es/index.js', format: 'es', indent: false },
		external,
		plugins: makePlugins(true),
	},

	{
		input: inputName,
		output: { file: 'es/index.mjs', format: 'es', indent: false },
		external,
		plugins: [
			...makePlugins(true),
			terser({
				compress: {
					pure_getters: true,
					unsafe: true,
					unsafe_comps: true,
					warnings: false,
				},
			}),
		],
	},

	{
		input: inputName,
		output: {
			file: 'dist/biscuit-store-adapter.js',
			format: 'umd',
			name: 'Biscuit-store-adapter',
			indent: false,
		},
		external,
		plugins: makePlugins(true),
	},
];