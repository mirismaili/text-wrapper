<p dir="auto">
	<a href="https://npmjs.com/package/text-wrapper">
		<img alt="npm (scoped)" src="https://img.shields.io/npm/v/text-wrapper.svg">
	</a>
	<a href="https://david-dm.org/mirismaili/text-wrapper">
		<img src="https://david-dm.org/mirismaili/text-wrapper.svg" alt="Dependencies Status">
	</a>
	<a href="https://david-dm.org/mirismaili/text-wrapper?type=dev">
		<img src="https://david-dm.org/mirismaili/text-wrapper/dev-status.svg" alt="devDependencies Status">
	</a>
	<a href="https://snyk.io//test/github/mirismaili/text-wrapper?targetFile=package.json">
		<img src="https://snyk.io//test/github/mirismaili/text-wrapper/badge.svg?targetFile=package.json" alt="Known Vulnerabilities" data-canonical-src="https://snyk.io//test/github/mirismaili/text-wrapper?targetFile=package.json">
	</a>
	<a href="https://packagephobia.now.sh/result?p=text-wrapper">
		<img src="https://packagephobia.now.sh/badge?p=text-wrapper" alt="install size">
	</a>
	<br>
	<a href="https://travis-ci.com/mirismaili/text-wrapper">
		<img src="https://travis-ci.com/mirismaili/text-wrapper.svg?branch=master" alt="Build Status">
	</a>
	<a href="https://codecov.io/github/mirismaili/text-wrapper">
		<img src="https://codecov.io/github/mirismaili/text-wrapper/branch/master/graph/badge.svg" alt="Coverage Status">
	</a>
	<br>
	<a href="http://commitizen.github.io/cz-cli/">
		<img alt="Commitizen friendly" src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg">
	</a>
	<a href="https://github.com/mirismaili/text-wrapper/fork">
		<img src="https://img.shields.io/github/forks/mirismaili/text-wrapper.svg?style=social" alt="GitHub forks">
	</a>
	<a href="https://github.com/mirismaili/text-wrapper">
		<img src="https://img.shields.io/github/stars/mirismaili/text-wrapper.svg?style=social" alt="GitHub stars">
	</a>
	<br>
	<a href="https://github.com/mirismaili/text-wrapper/blob/master/LICENSE">
		<img alt="GitHub" src="https://img.shields.io/github/license/mirismaili/text-wrapper.svg">
	</a>
</p>

**Text-Wrapper**

A library for wrapping (breaking) long lines of large texts into limited-length lines, based on given options

***

**Table of Contents**

* [Installation](#installation)
* [Basic Usage](#basic-usage)
* [Sample Input / Output](#sample-input--output)
* [Advanced Usage](#advanced-usage)
  * [Options](#options)
    * [Examples](#examples)
    * [The meaning of each option \+ Default values and Data\-types](#the-meaning-of-each-option--default-values-and-data-types)
      * [wrapOn: number = 100](#wrapon-number--100)
      * [tabLength: number = 4](#tablength-number--4)
      * [breakableCharacters: RegExp = /[^\\w\\xA0]/](#breakablecharacters-regexp--wxa0)
      * [allowedExceedingCharacters: RegExp = /\\s/](#allowedexceedingcharacters-regexp--s)
      * [continuationIndent: string = ''](#continuationindent-string--)
  * [Unicode support](#unicode-support)
  * [markers: An advanced way to get access to the process result](#markers-an-advanced-way-to-get-access-to-the-process-result)
  * [Wrap wrapped\!](#wrap-wrapped)
* [Debug](#debug)
* [Technical Overview](#technical-overview)

# Installation

- In a *npm project*, run:

    ```bash
    npm install text-wrapper
    ```

- In a *raw browser-target project*, use bundled version:

    ```html
    <script src=".../bundle.umd.js"></script>
    ```

  Download the latest version of `bundle.umd.js` file from [Releases page](https://github.com/mirismaili/text-wrapper/releases). There is also an ESM-bundle version that you can use it (just if you know what you do!).

# Basic Usage

1. Get access to `wrapper()` function:

    ```javascript
    // Below line is not required when you import the module in your HTML 
    // using <script> tag. it will be done automatically in that case.
    const text_wrapper_lib = require('text-wrapper')  
    
    const wrapper = text_wrapper_lib.wrapper
    ```
    
	Or through ES6-module-import way:
	
	```javascript
	import {wrapper} from 'text-wrapper'
	```

2. Take the job:

    ```javascript
    const wrappedOutput = wrapper(tooLongText)
    ```
    
    <sup>*See:* **[Sample Input / Output](#sample-input--output)**</sup>
***

By default, long lines will be broken after **100th character** *(max) (except white-spaces) (tab-character length will be calculated)*. You can customize this behavior:

```javascript
const wrappedOutput = wrapper(tooLongText, {wrapOn: 120})
```

See [Options](#options) for other possible customizations.

# Sample Input / Output

Below snippet:

<pre style="white-space:pre;overflow-x:scroll;"><span style="color:#d73a49">const</span> <span style="color:#005cc5">input</span> <span style="color:#d73a49">=</span> 
<span style="color:#6a737d">// (From https://en.wikipedia.org/wiki/Solar_System):</span>
<span style="color:#ad6101"><span>`The Solar System is the gravitationally bound planetary system of the Sun and the objects that orbit it, either directly or indirectly. Of the objects that orbit the Sun directly, the largest are the eight planets, with the remainder being smaller objects, such as the five dwarf planets and small Solar System bodies. Of the objects that orbit the Sun indirectly—the moons—two are larger than the smallest planet, Mercury.</span>
<span style="color:#ad6101"></span>
<span style="color:#ad6101">The Solar System formed 4.6 billion years ago from the gravitational collapse of a giant interstellar molecular cloud. The vast majority of the system's mass is in the Sun, with the majority of the remaining mass contained in Jupiter. The four smaller inner planets, Mercury, Venus, Earth and Mars, are terrestrial planets, being primarily composed of rock and metal. The four outer planets are giant planets, being substantially more massive than the terrestrials. The two largest, Jupiter and Saturn, are gas giants, being composed mainly of hydrogen and helium; the two outermost planets, Uranus and Neptune, are ice giants, being composed mostly of substances with relatively high melting points compared with hydrogen and helium, called volatiles, such as water, ammonia and methane. All eight planets have almost circular orbits that lie within a nearly flat disc called the ecliptic.<span class="pl-pds">`</span></span>

<span style="color:#6f42c1">console</span>.<span style="color:#005cc5">log</span>(<span style="color:#6f42c1">wrapper</span>(input, {wrapOn<span style="color:#d73a49">:</span> <span style="color:#005cc5">80</span>}))
</pre>

will out:

![sample-output.png](https://raw.githubusercontent.com/mirismaili/text-wrapper/988b1ae42c02a14153ef6eb48e7075aaa6746f6a/res/sample-output.png "Sample output")

# Advanced Usage

Although you can still use `wrapper()` function without any limitation, but for advanced usage, it's recommended to first make a new instance and then work with its `wrap()` method. So first:

```javascript
const TextWrapper = text_wrapper_lib.default
```

or:

```javascript
import TextWrapper from 'text-wrapper'
```

and then instantiate and do the job:

```javascript
const textWrapper = new TextWrapper()
const wrappedOutput = textWrapper.wrap(inputText)
```

## Options

You can pass your custom options to the constructor:

```javascript
new TextWrapper(options)
```

or to the `wrapper()` function:

```javascript
wrapper(inputText, options)
```

### Examples
```javascript
new TextWrapper({
	tabLength: 2,
	wrapOn: 120,
})
```
```javascript
new TextWrapper({
	tabLength: 8,
	continuationIndent: '\t',
})
```
```javascript
new TextWrapper({
	wrapOn: 95,
	tabLength: 3,
	breakableCharacters: /\W/,   // Any non-word character (equal to [^a-zA-Z0-9_])
	continuationIndent: '    ',  // 4 spaces
})
```

### The meaning of each option + Default values and Data-types

<sup>*You can find these documentations and information in source-codes as well. This is a [**Typescript**](https://www.typescriptlang.org/) project. Or refer to [docs](https://mirismaili.github.io/text-wrapper/) (Thank [TypeDoc](https://www.npmjs.com/package/typedoc)).*</sup>

#### `wrapOn: number = 100`

This is the most common option. It determines the maximum allowed length of each line. The words exceed this rule will go to the next line. There are some configurable options to say the program how does this work, which are coming ...

*Note:* Sometimes this is not possible, beacuse there is no breakable character (space, etc) until the limitation (`wrapOn` value). In these cases, the line will break later, but as soon as possible.

#### `tabLength: number = 4`

This determines the max-length that should be considered for tab-characters (`'\t'`). Notice that the length of each tab-character is depended on its location in its line. For example, if this option is set to `4`, then the length of `'\tA'` will appear `5` and the length of `'A\t'` will appear `4`.

 - *See also:* [visual (virtual) length: <b>vLen</b>](https://mirismaili.github.io/text-wrapper/classes/textwrapper.html#vlen) 
	
#### `breakableCharacters: RegExp = /[^\w\xA0]/`

Long lines don't break at any where the length is exceeded. But it occurs only on word-boundaries by default. So this options has been set to `/[^\w\xA0]/` to be broken on any non-word character (`/^\w/ === /[^a-zA-Z0-9_]/`) except a special white-space character named *non-breakable space (`'\xA0'`)*.

Note: This RegExp will be tested against only a single character (each time)!

#### `allowedExceedingCharacters: RegExp = /\s/`

This determines which characters are allowed to exceed the limitation (after [`wrapOn`](#wrapon-number--100) value). By default,
this has been set to `/\s/` to allow any white-space character. new-line-character (`'\n'`) will be ignored,
anyway.

Note: This RegExp will be tested against only a single character (each time)!

#### `continuationIndent: string = ''`

This value will be added after each line-break (`'\n'`) character that this tool adds to the text. So it appears in the leading of each new line (not the already-present lines).

## Unicode support
Unicode character classes are not supported widely, but if you just want distinct between word-characters and non-word characters, add a `u` flag to `breakableCharacters` default value:
 ```javascript
{ breakableCharacters: /[^\w\xA0]/u }
 ```
Note: Unicode-aware regular expressions needs ES2015 at least. See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicode#Specifications

## `markers`: An advanced way to get access to the process result

In cases, you don't want the final output itself (`wrappedText`), but you want a pure result of the process, `markers` is that you want! It's an array of all offsets that input-text needs line-breaks at them (to be wrapped correctly). To better understanding, we can *reproduce* the final output (`wrappedText`) using `markers` in a loop. Suppose you have an `inputText`, a `wrapOptions` object and an `alreadyPresentIndents` and:

```javascript
const wrapResult = new TextWrapper(wrapOptions).wrap(inputText, alreadyPresentIndents)

const output = wrapResult.wrappedText
const markers = wrapResult.markers
```

Then:

```javascript
const indentsN = alreadyPresentIndents + wrapOptions.continuationIndent

let anotherOutput = ''
let a = 0
for (const b of markers) {
    anotherOutput += input.slice(a, b) + '\n' + indentsN
    a = b
}

anotherOutput += input.slice(a)

expect(anotherOutput).toBe(output)
```

*This is one of the unit tests that this library must pass!* (See *"Reproduce output using markers"* in [jest/unit/text-wrapper.ts](https://github.com/mirismaili/text-wrapper/blob/master/jest/unit/text-wrap.ts))

## Wrap wrapped!

What happens if you double-wrap an input-text? This is another of unit tests in [jest/unit/text-wrapper.ts](https://github.com/mirismaili/text-wrapper/blob/master/jest/unit/text-wrap.ts):

```javascript
test('Wrap wrapped!', () => 
     expect(textWrapper.wrap(output, alreadyIndents).wrappedText).toBe(output))
```

# Debug

This library uses [npm debug library](https://www.npmjs.com/package/debug) (as its only dependency). The API has been completely exported by this library and you have full control over it. To access:

```javascript
const textWrapperDebug = require('../dist/main.umd.js').debug
```

Or:

```javascript
import {debug as textWrapperDebug} from 'text-wrapper'
```

Then you just need to know [debug package](https://www.npmjs.com/package/debug). For example, to enable debug-mode (according to [this](https://www.npmjs.com/package/debug#set-dynamically)) write:

```javascript
textWrapperDebug.enable('text-wrapper:*')
```

*Note 1: In this package, **debug-mode is disabled by default** (see `debug.disable()` in [src/TextWrapper.ts](https://github.com/mirismaili/text-wrapper/blob/master/src/TextWrapper.ts)). So even when `DEBUG` environment-variable is set to `*` you have no debug output from this package.*

*Note 2: All debug-namespaces (see [debug's docs](https://github.com/visionmedia/debug/blob/master/README.md)) start with `text-wrapper:`.*

# Technical Overview

<p dir="auto">
	<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript">#Javascript</a>
	<br>
	<a href="https://www.npmjs.com/">#npm</a>
</p>

<p dir="auto">
	<b>Source</b>:<br>
	&emsp;&emsp;<a href="https://github.com/mirismaili/text-wrapper">https://github.com/mirismaili/text-wrapper</a>
</p>

<p dir="auto">
	<b>Targets</b>:
	<br>
	&emsp;&emsp;All ES6+ Javascript environments
	<br>
	&emsp;&emsp;<b>Tested on</b>: Node 10, 11, 12 / Chromium: 76
</p>

<p dir="auto">
	<b>Release 1</b> (npm):
	<br>
	&emsp;&emsp;<a href="https://www.npmjs.com/package/text-wrapper">https://www.npmjs.com/package/text-wrapper</a>
</p>

<p dir="auto">
	<b>Release 2</b> (all):
	<br>
	&emsp;&emsp;<a href="https://github.com/mirismaili/text-wrapper/releases">https://github.com/mirismaili/text-wrapper/releases</a>
</p>

<p dir="auto">
	<b>Documentation</b> (full):
	<br>
	&emsp;&emsp;<a href="https://mirismaili.github.io/text-wrapper/">https://mirismaili.github.io/text-wrapper/</a>
</p>

<p dir="auto">
	<b>Workflow</b>:
	<br>
	&emsp;&emsp;<a href="https://github.com/users/mirismaili/projects/1">https://github.com/users/mirismaili/projects/1</a>
</p>

<p dir="auto">
	<b>Distribution-type</b>: library
</p>

<p dir="auto">
	<b>Executables</b>: none
</p>

<p dir="auto">
	<b>Most important used technologies</b>:
	<br>
	&emsp;&emsp;● jest (test framework)
	<br>
	&emsp;&emsp;● puppeteer (browser-based end-to-end test)
	<br>
	&emsp;&emsp;● codecov (test-coverage report) - <a href="https://codecov.io/github/mirismaili/text-wrapper">Report</a>
	<br>
	&emsp;&emsp;● rollup.js (bundle tool)
	<br>
	&emsp;&emsp;● Typescript
	<br>
	&emsp;&emsp;● Travis (CI) - <a href="https://travis-ci.com/mirismaili/text-wrapper/builds">Log</a>
	<br>
	&emsp;&emsp;● commitizen (conventional commits)
	<br>
	&emsp;&emsp;● semantic-release (automatic version and release manager)
</p>

<p dir="auto">
	Dependencies #: <a href="https://david-dm.org/mirismaili/text-wrapper">1</a>
</p>

<p dir="auto">
	Dev-dependencies #: <a href="https://david-dm.org/mirismaili/text-wrapper?type=dev">37</a>
</p>
