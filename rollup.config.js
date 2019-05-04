import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import camelCase from 'lodash.camelcase'
import typescript from 'rollup-plugin-typescript2'
import json from 'rollup-plugin-json'
import { terser } from "rollup-plugin-terser"

const pkg = require('./package.json')

const libraryName = 'text-wrap'
const libVarName = camelCase(libraryName)
const libClassName = `${libVarName[0].toUpperCase() + libVarName.slice(1)}` // PascalCase

// noinspection JSUnusedGlobalSymbols
export default {
	input: `src/${libClassName}.ts`,
	output: [
		{file: pkg.main, name: libVarName, format: 'umd', sourcemap: true, exports: 'named'},
		{file: pkg.module, format: 'esm', sourcemap: true},
	],
	// Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
	external: [],
	watch: {
		include: 'src/**',
	},
	plugins: [
		// Allow json resolution
		json(),
		// Compile TypeScript files
		typescript({useTsconfigDeclarationDir: true}),
		// Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
		commonjs(),
		// Allow node_modules resolution, so you can use 'external' to control
		// which external modules to include in the bundle
		// https://github.com/rollup/rollup-plugin-node-resolve#usage
		resolve(),
		
		// Resolve source maps to the original source
		sourceMaps(),
		(process.env.BUILD === 'production' && terser()),
	],
}
