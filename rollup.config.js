import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import camelCase from 'lodash.camelcase'
import typescript from 'rollup-plugin-typescript2'
import {terser} from "rollup-plugin-terser"
import tempDir from 'temp-dir'
import autoExternal from 'rollup-plugin-auto-external'
import globals from 'rollup-plugin-node-globals'
import builtins from 'rollup-plugin-node-builtins'

const pkg = require('./package.json')

const libraryName = pkg.name.slice(pkg.name.indexOf('/') + 1)
const libVarName = camelCase(libraryName)
const libClassName = `${libVarName[0].toUpperCase() + libVarName.slice(1)}` // PascalCase

const input = `src/${libClassName}.ts`
const watch = {include: 'src/**'}
const isProd = process.env.BUILD === 'production'

const commonPlugins = [
	typescript({
		useTsconfigDeclarationDir: true,
		cacheRoot: `${tempDir}/.rpt2_cache`, // See: https://github.com/ezolenko/rollup-plugin-typescript2/issues/34#issuecomment-332591290
	}),
	commonjs(),
	(isProd && terser()),
	sourceMaps()
]

const bundledOutput = {
	input: input,
	output: [
		{
			format: 'esm', file: pkg["bundle-module"], sourcemap: true
		},
		{
			format: 'umd', file: pkg.bundle, name: libVarName, sourcemap: true, exports: 'named',
		},
	],
	watch: watch,
	plugins: commonPlugins.concat([
		globals(),
		builtins(),
		resolve(),
	]),
}

const dependentOutput = {
	input: input,
	output: {
		format: 'umd', file: pkg.main, name: libVarName, sourcemap: true, exports: 'named',
		globals: {}
	},
	watch: watch,
	plugins: commonPlugins.concat([
		autoExternal(),
	]),
}

// noinspection JSUnusedGlobalSymbols
export default isProd ? [dependentOutput, bundledOutput] : dependentOutput
