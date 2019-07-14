import os from 'os'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import camelCase from 'lodash.camelcase'
import snakeCase from 'lodash.snakecase'
import typescript from 'rollup-plugin-typescript2'
import {terser} from 'rollup-plugin-terser'
import nodeGlobals from 'rollup-plugin-node-globals'
import nodeBuiltins from '@joseph184/rollup-plugin-node-builtins'
import replace from 'rollup-plugin-replace'
import builtins from 'builtin-modules/static'

const pkg = require('./package.json')

const libraryName = pkg.name.slice(pkg.name.indexOf('/') + 1)
const libVarName = snakeCase(libraryName) + '_lib'
const varName = camelCase(libraryName)
const libClassName = `${varName[0].toUpperCase() + varName.slice(1)}` // PascalCase

const input = `src/${libClassName}.ts`
const watch = {include: 'src/**'}
const isProd = process.env.BUILD === 'production'
const uglify = process.env.UGLIFY

const plugins = [
	replace({
		include: [
			'src/**/*.ts',
		],
		delimiters: ['<@', '@>'],
		values: {
			MODULE_NAME: libraryName, //JSON.stringify(libraryName)
		},
	}),
	typescript({
		useTsconfigDeclarationDir: true,
		cacheRoot: `${os.tmpdir()}/.rpt2_cache`, // See: https://github.com/ezolenko/rollup-plugin-typescript2/issues/34#issuecomment-332591290
	}),
	commonjs(),
	(uglify === 'true' || uglify !== 'false' && isProd) && terser(),
	sourceMaps(),
]

const bundledOutput = {
	input: input,
	output: [
		{format: 'umd', file: pkg.bundle, name: libVarName, sourcemap: true, exports: 'named'},
		{format: 'esm', file: pkg["bundle-module"], sourcemap: true},
	],
	watch: watch,
	plugins: [...plugins,
		nodeGlobals(),
		nodeBuiltins(),
		resolve(),
	],
}

const externals = [...builtins, ...Object.keys(pkg.dependencies || {})]

const globals = {}
externals.map(key => globals[key] = /[-.]/.test(key) ? camelCase(key) : key)

const dependentOutput = {
	input: input,
	output: {format: 'umd', file: pkg.main, name: libVarName, sourcemap: true, exports: 'named', globals: globals},
	watch: watch,
	external: externals,
	plugins: plugins,
}

// noinspection JSUnusedGlobalSymbols
export default isProd ? [dependentOutput, bundledOutput] : dependentOutput
