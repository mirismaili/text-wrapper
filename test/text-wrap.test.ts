import * as fs from 'fs'
import { sha256 } from 'js-sha256'
import TextWrapper from '../src/TextWrap'
//*********************************************************/

const input =
      fs.readFileSync('./test/input.txt', 'utf8').replace(/(?:\r\n|\r)/g, '\n')

const indents = ''
const maxLineLength = 120
const wrapResult = new TextWrapper({ wrapOn: maxLineLength }).wrap(input, indents)
const output = wrapResult.wrappedText
//*********************************************************/

const joinedInput = input.replace(/\n/g, '')
const joinedOutput = output.replace(/\n/g, '')

//*********************************************************/
describe('General tests:', () => {
  it('Check output itself', () => expect(joinedOutput).toBe(joinedInput))

  it('Check num of markers', () =>
    expect(wrapResult.markers.length).toBe(output.length - input.length))

  it(
    'Try to find an illegal short line (two markers which [the distance between the first marker and the first' +
      ' breakable character after the second marker] is less than or equal with [maxLineLength])',
    () => {
      // noinspection JSUnusedAssignment
      let b = 0
      let a = 0
      for (b of wrapResult.markers) {
        const regexp = /[^\S\xA0]/g
        regexp.lastIndex = b

        const upBound = regexp.test(input) ? regexp.lastIndex - 1 : input.length
        const distance = upBound - a

        expect(distance > maxLineLength).toBe(true)

        a = b
      }
    }
  )

  it("Try to find an illegal long line in output (a line that should to be wrapped, but didn't)", () =>
    expect(
      // https://regex101.com/r/bdWnCx/1/
      new RegExp(`^(?=.{${maxLineLength},}[\\S\\xA0])(?=.*[^\\S\\xA0\\n]).*`).test(output)
    ).toBeFalsy())

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
  //*********************************************************/
})

const hash = sha256.create()
describe('Case-specific tests:', () => {
  it("Check input's hash", () => {
    hash.update(input)
    expect(hash.hex()).toBe('1492be56b606c3467846e592d3e2c3eba3af600737705c70e8005e6c28a8ca3b')
  })

  it("Check output's hash", () => {
    hash.update(output)
    expect(hash.hex()).toBe('1492be56b606c3467846e592d3e2c3eba3af600737705c70e8005e6c28a8ca3b')
  })
})
