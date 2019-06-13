<p dir="auto">
	<a href="https://npmjs.com/package/text-wrapper">
			<img alt="npm (scoped)" src="https://img.shields.io/npm/v/text-wrapper.svg">
		</a>
		<a href="https://npmjs.com/package/text-wrapper">
			<img alt="npm" src="https://img.shields.io/npm/dt/text-wrapper.svg">
		</a>
		<a href="https://packagephobia.now.sh/result?p=text-wrapper">
			<img src="https://packagephobia.now.sh/badge?p=text-wrapper" alt="install size">
		</a>
		<br>
		<a href="https://travis-ci.com/mirismaili/text-wrapper">
			<img src="https://travis-ci.com/mirismaili/text-wrapper.svg?branch=master" alt="Build Status">
		</a>
		<a href="https://codecov.io/github/mirismaili/text-wrapper">
			<img src="https://codecov.io/github/mirismaili/text-wrapper/branch/master/graph/badge.svg" alt="codecov">
		</a>
		<a href="https://david-dm.org/mirismaili/text-wrapper">
			<img src="https://david-dm.org/mirismaili/text-wrapper.svg" alt="Dependency Status">
		</a>
		<a href="https://david-dm.org/mirismaili/text-wrapper?type=dev">
			<img src="https://david-dm.org/mirismaili/text-wrapper/dev-status.svg" alt="devDependency Status">
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

A utility to wrap (break) long lines of large texts into limited-length lines, based on given options

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

# Installation

- In a *npm project*, run:

    ```bash
    npm install text-wrapper
    ```

- In a *raw browser-target project*, use bundle version:

    ```html
    <script src=".../bundle.umd.js"></script>
    ```

  Download the latest version of `bundle.umd.js` file from [Releases page](https://github.com/mirismaili/text-wrapper/releases). There is also an ESM-bundle version that you can use it (just if you know what you do!).

# Basic Usage

1. Access `TextWrapper` class:

    ```javascript
    // Below line is not required when you import the module in your HTML 
    // using <script> tag. it will be done automatically in that case.
    const text_wrapper_lib = require('text-wrapper')  
    
    // The main thing you need:
    const TextWrapper = text_wrapper_lib.default
    ```

    Or easily using ES6-module-import:

    ```javascript
    import TextWrapper from 'text-wrapper'
    ```

2. Make new instances and start the work:

    ```javascript
    const textWrapper = new TextWrapper()
    
    // Do the work:
    const wrapResult = textWrapper.wrap(tooLongText)
    
    // Get the result:
    const wrappedOutput = wrapResult.wrappedText
    ```

*All in one statement:*

```javascript
const wrappedOutput = 
      new (require('text-wrapper').default)().wrap(tooLongText).wrappedText
```

By default, long lines will be broken after **100th character** *(max) (except white-spaces) (tab-character length will be calculated)*. You can customize this behavior:

```javascript
const textWrapper = new TextWrapper({wrapOn: 120})
```

See [Options](#options) for other possible customizations.

# Sample Input / Output

Below snippet:

<pre style="white-space:pre;overflow-x:scroll;"><span style="color:#d73a49">const</span> <span style="color:#005cc5">input</span> <span style="color:#d73a49">=</span> 
<span style="color:#6a737d">// (From https://en.wikipedia.org/wiki/Solar_System):</span>
<span style="color:#ad6101"><span>`The Solar System is the gravitationally bound planetary system of the Sun and the objects that orbit it, either directly or indirectly. Of the objects that orbit the Sun directly, the largest are the eight planets, with the remainder being smaller objects, such as the five dwarf planets and small Solar System bodies. Of the objects that orbit the Sun indirectly—the moons—two are larger than the smallest planet, Mercury.</span>
<span style="color:#ad6101"></span>
<span style="color:#ad6101">The Solar System formed 4.6 billion years ago from the gravitational collapse of a giant interstellar molecular cloud. The vast majority of the system's mass is in the Sun, with the majority of the remaining mass contained in Jupiter. The four smaller inner planets, Mercury, Venus, Earth and Mars, are terrestrial planets, being primarily composed of rock and metal. The four outer planets are giant planets, being substantially more massive than the terrestrials. The two largest, Jupiter and Saturn, are gas giants, being composed mainly of hydrogen and helium; the two outermost planets, Uranus and Neptune, are ice giants, being composed mostly of substances with relatively high melting points compared with hydrogen and helium, called volatiles, such as water, ammonia and methane. All eight planets have almost circular orbits that lie within a nearly flat disc called the ecliptic.<span class="pl-pds">`</span></span>

<span style="color:#6f42c1">console</span>.<span style="color:#005cc5">log</span>(
	<span style="color:#d73a49">new</span> <span style="color:#6f42c1">TextWrapper</span>({wrapOn<span style="color:#d73a49">:</span> <span style="color:#005cc5">80</span>}).<span style="color:#6f42c1">wrap</span>(input).<span class="pl-smi">wrappedText</span>
)
</pre>

will out:
<div style="background-color:#f6f8fa;">
<pre style="display:inline-block;padding-right:0;background-color:#0000;border-right: 1px dashed #AAA;">
<span style="color:#ad6101">The Solar System is the gravitationally bound planetary system of the Sun and 
the objects that orbit it, either directly or indirectly. Of the objects that 
orbit the Sun directly, the largest are the eight planets, with the remainder 
being smaller objects, such as the five dwarf planets and small Solar System 
bodies. Of the objects that orbit the Sun indirectly—the moons—two are larger 
than the smallest planet, Mercury.
<br>The Solar System formed 4.6 billion years ago from the gravitational collapse of 
a giant interstellar molecular cloud. The vast majority of the system's mass is 
in the Sun, with the majority of the remaining mass contained in Jupiter. The 
four smaller inner planets, Mercury, Venus, Earth and Mars, are terrestrial 
planets, being primarily composed of rock and metal. The four outer planets are 
giant planets, being substantially more massive than the terrestrials. The two 
largest, Jupiter and Saturn, are gas giants, being composed mainly of hydrogen 
and helium; the two outermost planets, Uranus and Neptune, are ice giants, being 
composed mostly of substances with relatively high melting points compared with 
hydrogen and helium, called volatiles, such as water, ammonia and methane. All 
eight planets have almost circular orbits that lie within a nearly flat disc 
called the ecliptic.</span>
</pre></div>
Image:

![sample-output.png](https://raw.githubusercontent.com/mirismaili/text-wrapper/974b4440ffdc1eb27ae52c97c0e814936763e9bd/res/sample-output.png "Sample output")

# Advanced Usage

## Options

You can pass your custom options to the constructor:

```javascript
new TextWrapper(options)
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

#### `tabLength: number = 4`

This determines the max-length that should be considered for tab-characters (`'\t'`). Notice that the length of each tab-character is depended on its location in its line. For example, if this option is set to `4`, then the length of `'\tA'` will appear `5` and the length of `'A\t'` will appear `4`.
	
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
