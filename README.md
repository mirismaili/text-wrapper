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

By default, long lines will be broken after 100th character (max) (except white-spaces). You can customize this behavior:

```javascript
const textWrapper = new TextWrapper({wrapOn: 120})
```

# Sample Input / Output

Below snippet:

```javascript
const input = 
// (From https://en.wikipedia.org/wiki/Solar_System):
`The Solar System is the gravitationally bound planetary system of the Sun and the objects that orbit it, either directly or indirectly. Of the objects that orbit the Sun directly, the largest are the eight planets, with the remainder being smaller objects, such as the five dwarf planets and small Solar System bodies. Of the objects that orbit the Sun indirectly—the moons—two are larger than the smallest planet, Mercury.

The Solar System formed 4.6 billion years ago from the gravitational collapse of a giant interstellar molecular cloud. The vast majority of the system's mass is in the Sun, with the majority of the remaining mass contained in Jupiter. The four smaller inner planets, Mercury, Venus, Earth and Mars, are terrestrial planets, being primarily composed of rock and metal. The four outer planets are giant planets, being substantially more massive than the terrestrials. The two largest, Jupiter and Saturn, are gas giants, being composed mainly of hydrogen and helium; the two outermost planets, Uranus and Neptune, are ice giants, being composed mostly of substances with relatively high melting points compared with hydrogen and helium, called volatiles, such as water, ammonia and methane. All eight planets have almost circular orbits that lie within a nearly flat disc called the ecliptic.`

console.log(
	new TextWrapper({wrapOn: 80}).wrap(input).wrappedText
)
```
will output:
```
The Solar System is the gravitationally bound planetary system of the Sun and 
the objects that orbit it, either directly or indirectly. Of the objects that 
orbit the Sun directly, the largest are the eight planets, with the remainder 
being smaller objects, such as the five dwarf planets and small Solar System 
bodies. Of the objects that orbit the Sun indirectly—the moons—two are larger 
than the smallest planet, Mercury.

The Solar System formed 4.6 billion years ago from the gravitational collapse of 
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
called the ecliptic.
```
Image:

![sample-output.png](https://raw.githubusercontent.com/mirismaili/text-wrapper/974b4440ffdc1eb27ae52c97c0e814936763e9bd/res/sample-output.png "Sample output")