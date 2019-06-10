import Debug from 'debug'

import {initiateObject} from './utilities'

const logEachChar = Debug('AC')
const logFastCheck = Debug('FC')
const logBreak = Debug('BR')
const logBreakLine = Debug('BL')
const logMainLoop = Debug('ML')
const log = Debug('GENERAL')
Debug.log = console.debug.bind(console)

Debug.formatters.c = (f: () => string) => f()

/**
 * @author [S. Mahdi Mir-Ismaili](https://mirismaili.github.io)
 * Created on 1398/2/6 (2019/4/26).
 */
export default class TextWrapper implements WrapOptions {
	// tslint:disable-next-line:variable-name
	private readonly tabLength_1: number
	
	readonly continuationIndent!: string
	readonly tabLength!: number
	readonly wrapOn!: number
	readonly allowedExceedingCharacters!: RegExp
	readonly breakableCharacters!: RegExp
	
	constructor(wrapStyle: WrapOptions = DEF_WRAP_OPTIONS) {
		initiateObject(this, wrapStyle, DEF_WRAP_OPTIONS)
		log(this)
		this.tabLength_1 = this.tabLength - 1
	}
	
	wrap(text: string, indents = ''): WrapResult {
		const markers: number[] = []
		const tabLength = this.tabLength
		const length = text.length
		const indentsN = indents + this.continuationIndent
		const indentsNVLen = this.getVisualLength(indentsN, 0)
		
		let previousMarker = 0
		let wrappedText = ''
		
		for (
				let i = 0, vLen = 0, draftVLen = 0, start = 0, draftMarker = 0, c: string, fastCheck = false;
				i < length;
				++i
		) {
			c = text[i]
			vLen += c === '\t' ? tabLength - vLen % tabLength : 1
			logEachChar(`%s / %d`, c, vLen)
			
			// tslint:disable-next-line:label-position
			if (c === '\n') {
				logBreakLine('vLen: %d / draftVLen: %d / fastCheck: %s', vLen, draftVLen, fastCheck)
				fastCheck = false
				
				start = i + 1        // Set to start of the next line
				draftVLen = vLen = 0 // Reset vLen and draftVLen
				continue
			}
			
			const isNotBreakable = !this.breakableCharacters.test(c)
			
			if (vLen > this.wrapOn) {
				logFastCheck(fastCheck)
				// 1. PASSED
				if (fastCheck ||
						start === -1 && draftMarker === previousMarker ||
						start !== -1 &&
								// The 2nd condition will always be true if the 1st is true. Actually, it is the main condition
								// we need to check, but we know in almost all cases the 1st (that is much simpler) is true.
								!(draftMarker - start > indentsNVLen ||
										this.getVisualLength(text.slice(start, draftMarker)) > indentsNVLen)
						// tslint:disable-next-line:no-conditional-assignment
						//&& (fastCheck = true)
				) {
					// 1.1. PASSED but CAN'T
					fastCheck = true
					
					logFastCheck('draftMarker: %d, start: %d', draftMarker, start)
					if (isNotBreakable) /* 1.1.1. PASSED but CAN'T and NO DRAFT_MARKER NEEDED */ continue
					
					// 1.1.2. PASSED but CAN'T and DRAFT_MARKER NEEDED
					
					logFastCheck('')
					fastCheck = false
				} else { // 1.2. PASSED and CAN
					if (!this.allowedExceedingCharacters.test(c)) { // 1.2.1. PASSED and CAN and MUST
						markers.push(draftMarker)
						wrappedText += text.slice(previousMarker, draftMarker) + '\n' + indentsN
						
						const nextVLen = indentsNVLen + (vLen - draftVLen)
						logBreak('[%d, %d) / vLen: %d / nextVLen: %d\n%c',   // %c: callback. See `Debug.formatters.c` above.
								previousMarker, draftMarker, vLen, nextVLen, () => text.slice(previousMarker, draftMarker))
						
						previousMarker = draftMarker  // Store the value of draftMarker
						start = -1                    // `start` is not needed when we adding `indentsN` to the start of the next line
						vLen = nextVLen
						
						if (isNotBreakable) { // 1.2.1.1. PASSED and CAN and MUST and NO DRAFT_MARKER NEEDED
							draftVLen = indentsNVLen
							continue
						}
						// else => 1.2.1.2. PASSED and CAN and MUST + DRAFT_MARKER NEEDED
					}
					// else => 1.2.2. PASSED and CAN but MUST NOT
				}
			} else { // 2. NOT PASSED
				if (isNotBreakable) // 2.1. NOT PASSED and NO DRAFT_MARKER NEEDED
					continue
				// else => 2.2. NOT PASSED and DRAFT_MARKER NEEDED
			}
			
			// Any breakable character:
			
			// 1.1.2.   PASSED but CAN'T and DRAFT_MARKER NEEDED
			// 1.2.1.2. PASSED and CAN and MUST + DRAFT_MARKER NEEDED
			// 1.2.2.   PASSED and CAN but MUST NOT
			// 2.2.     NOT PASSED and DRAFT_MARKER NEEDED
			
			// => DRAFT_MARKER NEEDED
			
			// Find the first notAllowedExceedingCharacter after i and calculate new vLen:
			for (++i; i < length; ++i) {
				const ch = text[i]
				if (!this.allowedExceedingCharacters.test(ch) || ch === '\n' || ch === '\r') break
				vLen += ch === '\t' ? tabLength - vLen % tabLength : 1
			}
			
			draftMarker = i--    // Store the value of i+1
			draftVLen = vLen     // Store the value of vLen
		}
		
		logMainLoop(`previousMarker: %d\n%s`, previousMarker, wrappedText)
		
		return {
			markers: markers,
			wrappedText:
					wrappedText + text.slice(previousMarker, length) // CAVEAT: Don't omit `wrappedText.length` from the second argument of .slice()! Maybe: indentsN.length===0
		}
	}
	
	getVisualLength(s: string, visualOffset: number = 0): number {
		let a = 0
		let b: number
		let vLen = 0
		
		while (true) {
			b = s.indexOf('\t', a)
			if (b === -1) return vLen + (s.length - a)
			
			vLen += (b - a)
			vLen += this.tabLength - (vLen + visualOffset) % this.tabLength
			
			a = b + 1
		}
		
		//return s.length + this.tabLength_1 * (s.split('\t').length - 1) // (s.split('\t').length-1) counts '\t's in `s`
	}
	
	debug = {
		enable: Debug.enable,
		disable: Debug.disable,
		setLog: (log: (...args: any[]) => any) => Debug.log = log
	}
}

export interface WrapResult {
	markers: number[]
	wrappedText: string
}

export interface WrapOptions {
	continuationIndent?: string
	tabLength?: number
	wrapOn?: number
	allowedExceedingCharacters?: RegExp
	breakableCharacters?: RegExp
}

export const DEF_WRAP_OPTIONS: WrapOptions = {
	continuationIndent: '',
	tabLength: 4,
	wrapOn: 100,
	allowedExceedingCharacters: /\s/,
	breakableCharacters: /[^\w\xA0]/,
}
