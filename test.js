/**
 * @author [S. Mahdi Mir-Ismaili](https://mirismaili.github.io).
 * Created on 1398/2/11 (2019/5/1).
 */
/* global require */
"use strict";

const assert = require('assert').strict;
const fs = require('fs');

const sha256 = require('js-sha256');

const lib = require('./dist/TextWrap');
//*********************************************************/

const input = fs.readFileSync('./test.txt', 'utf8').replace(/(?:\r\n|\r)/g, '\n');

const indents = '';
const maxLineLength = 120;
const wrapResult = (new lib.TextWrap({wrapOn: maxLineLength})).wrap(input, indents);
const output = wrapResult.wrappedText;
//*********************************************************/

const joinedInput = input.replace(/\n/g, '');
const joinedOutput = output.replace(/\n/g, '');

it('Check joinedInput correctly created.', () => assert.equal(
		joinedInput.length + input.split('\n').length - 1,
		input.length
));

it('Check joinedOutput correctly created.', () => assert.equal(
		joinedOutput.length + output.split('\n').length - 1,
		output.length
));

it('Check output itself', () => assert.equal(joinedOutput, joinedInput));

it('Check num of markers', () => assert.equal(wrapResult.markers.length, output.length - input.length));

it("Try to find an illegal short line (two markers which [the distance between the first marker and the first" +
		" breakable character after the second marker] is less than or equal with [maxLineLength])", () => {
	// noinspection JSUnusedAssignment
	let b = 0;
	let a = 0;
	for (b of wrapResult.markers) {
		const regexp = /[^\S\xA0]/g;
		regexp.lastIndex = b;
		
		const upBound = regexp.test(input) ? regexp.lastIndex - 1 : input.length;
		const distance = upBound - a;
		
		assert.equal(distance > maxLineLength, true);
		
		a = b;
	}
});

it("Try to find an illegal long line in output (a line that should to be wrapped, but didn't)", () => assert.equal(
		new RegExp(`^(?=.{${maxLineLength},}[\\S\\xA0])(?=.*[^\\S\\xA0\\n]).*`, 'm').test(output),  // https://regex101.com/r/bdWnCx/1/
		false
));

it('Check markers against output', () => {
	let anotherOutput = '';
	let a = 0;
	for (const b of wrapResult.markers) {
		anotherOutput += input.slice(a, b) + '\n' + indents;
		a = b;
	}
	
	if (a > 0) anotherOutput += input.slice(a);
	else anotherOutput = input;
	
	assert.equal(anotherOutput, output);
});
//*********************************************************/
// CASE-SPECIFIC TESTS:

it("Check input's hash", () => assert.equal(
		sha256(input), '1492be56b606c3467846e592d3e2c3eba3af600737705c70e8005e6c28a8ca3b')
);

it("Check output's hash", () => assert.equal(
		sha256(output), '3e3e0bd3e5e2d0d8770b873bbcfcba6b96689b91c3d5f7049fa610cf7097fa35')
);

