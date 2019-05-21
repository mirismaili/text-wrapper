import * as fs from 'fs'
import {sha256} from 'js-sha256'
import TextWrapper from '../src/TextWrap'

/**
 * @author [S. Mahdi Mir-Ismaili](https://mirismaili.github.io)
 * Created on 1398/2/13 (2019/5/3).
 */

const inputExpectedHash = '117677f3e12ded864c527d4f03583d4dd0be3cc0542c3cbbdbb01574dcf280c8'
const outputExpectedHash = '2e1bd0f9ae5b0ee9406908f58bd5b4030bbcdf464e5462e0fd1b142d49dbac2d'

const input = fs.readFileSync('./test/input.txt', 'utf8').replace(/\r\n|\r/g, '\n')

const indents = ''
const maxLineLength = 50
const textWrapper = new TextWrapper({wrapOn: maxLineLength})
const wrapResult = textWrapper.wrap(input, indents)
const output = wrapResult.wrappedText

const joinedInput = input.replace(/\n/g, '')
const joinedOutput = output.replace(/\n/g, '')

describe('General tests:', () => {
	it('Check output itself', () => expect(joinedOutput).toBe(joinedInput))
	
	it('Check num of markers', () => expect(wrapResult.markers.length).toBe(output.length - input.length))
	
	it('Try to find an illegal short line',
			// Two markers which [the distance between the first marker and the first breakable character after the second
			// marker] is less than or equal with [maxLineLength]
			() => {
				let a = 0
				for (let b of wrapResult.markers) {
					const regexp = /[^\S\xA0]/g
					regexp.lastIndex = b
					
					const upBound = regexp.test(input) ? regexp.lastIndex - 1 : input.length
					const distance = textWrapper.getVisualLength(input.slice(a, upBound), 0)
					
					expect(distance).toBeGreaterThan(maxLineLength)
					
					a = b
				}
			}
	)
	
	it("Try to find an illegal long line in output", // A line that should to be wrapped, but didn't
			() => {
				const regExp = new RegExp(`^(?=.*[^\\S\\xA0\\n](?![^\\S\\xA0\\n]|$)).{${maxLineLength},}[\\S\\xA0]`,
						'gm')	// https://regex101.com/r/bdWnCx/2/
				
				expect(regExp.test(output)).toBeFalsy()
			})
	
	it('Check markers against output', () => {
		let anotherOutput = ''
		let a = 0
		for (const b of wrapResult.markers) {
			anotherOutput += input.slice(a, b) + '\n' + indents
			a = b
		}
		
		if (a > 0) anotherOutput += input.slice(a)
		else anotherOutput = input
		
		expect(anotherOutput).toBe(output)
	})
})

describe('Case-specific tests:', () => {
	it("Check input's hash", () => expect(sha256(input)).toBe(inputExpectedHash))
	it("Check output's hash", () => expect(sha256(output)).toBe(outputExpectedHash))
})
