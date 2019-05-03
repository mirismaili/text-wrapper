// @ts-ignore
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
// @ts-ignore
import sourceMaps from 'rollup-plugin-sourcemaps'
// @ts-ignore
import camelCase from 'lodash.camelcase'
import typescript from 'rollup-plugin-typescript2'
// @ts-ignore
import json from 'rollup-plugin-json'

const pkg = require('./package.json')

const libraryName = 'text-wrap'
const libVarName = camelCase(libraryName)
const libClassName = `src/${libVarName[0] + libVarName.slice(1)}.ts` // PascalCase

// noinspection JSUnusedGlobalSymbols
export default {
  input: libClassName,
  output: [
    { file: pkg.main, name: libVarName, format: 'umd', sourcemap: true, exports: 'named' },
    { file: pkg.module, format: 'es', sourcemap: true },
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
    typescript({ useTsconfigDeclarationDir: true }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),

    // Resolve source maps to the original source
    sourceMaps(),
  ],
}
