
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import babel, { getBabelOutputPlugin } from '@rollup/plugin-babel';
import { builtinModules } from 'module';

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

export default [
    {
        input: 'src/index.js',
        output: { file: 'lib/index.js', format: 'cjs', indent: false },
        external,
        plugins: makePlugins(false),
    },

    {
        input: 'src/index.js',
        output: { file: 'es/index.js', format: 'es', indent: false },
        external,
        plugins: makePlugins(true),
    },
];