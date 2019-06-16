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
 * The main class of this library.
 *
 * {@link TextWrapper.constructor Create an instance} (with or without {@link WrapOptions options}) and then use
 * {@linkcode TextWrapper.wrap wrap()} method to do the task.
 *
 * Created at 1398/2/6 (2019/4/26).
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 *
 * @see {@link TextWrapper.constructor The constructor}
 * @see {@linkcode TextWrapper.wrap wrap()}
 */
export default class TextWrapper implements WrapOptions {
	// tslint:disable-next-line:variable-name
	private readonly tabLength_1: number
	
	readonly continuationIndent!: string
	readonly tabLength!: number
	readonly wrapOn!: number
	readonly allowedExceedingCharacters!: RegExp
	readonly breakableCharacters!: RegExp
	
	/**
	 * @see {@linkcode DEF_WRAP_OPTIONS}
	 */
	constructor(wrapOptions: WrapOptions = DEF_WRAP_OPTIONS) {
		initiateObject(this, wrapOptions, DEF_WRAP_OPTIONS)
		log(this)
		this.tabLength_1 = this.tabLength - 1
	}
	
	/**
	 * The main process in this library is done by this method. Gets a string and wraps illegal-too-long-lines of it. To
	 * configure and customize its operation pass a {@linkcode WrapOptions} to the class constructor}.
	 * Note: This is an *instance method* and needs to a an {@link TextWrapper.constructor object instantiation} first.
	 *
	 * @param text The string that probably has long lines and must be wrapped (broken to limited-length lines) based on
	 * {@linkcode WrapOptions} that has been passed to the {@link TextWrapper.constructor class constructor}
	 *
	 * @param alreadyPresentIndentation If your input text has a fixed indentation in the leading of its lines already,
	 * pass it (as a string) to this parameter. <br>
	 * ***Important note***: The library doesn't check this *indentation* actually presents or not.
	 * It just appends this to the {@linkcode WrapOptions.continuationIndent} (that you passed to the
	 * {@link TextWrapper.constructor class constructor}).
	 * In other words, (for a single run of this method per an instantiation) there is no difference whether you pass:
	 * <br>
	 * **`s1` to {@link WrapOptions.continuationIndent `WrapOptions.continuationIndent`}** and **`s2` to this parameter**
	 * <br>or: <br>
	 * **`s3` to {@link WrapOptions.continuationIndent `WrapOptions.continuationIndent`}** and **`s4` to this parameter**
	 * <br>
	 * **while `(s1 + s2 === s3 + s4)`**. The library works with *the whole* always.
	 * In these cases, this is just a logical separation (and maybe usable in the future).
	 *
	 * @return {WrapResult} Two things that will be stored in a {@linkcode WrapResult}:
	 * 1. {@linkcode WrapResult.wrappedText wrappedText: string} *(probably you want this)*
	 * 2. {@linkcode WrapResult.markers markers: number[]}
	 *
	 * @see {@linkcode WrapResult}
	 * @see {@linkcode TextWrapper.constructor class constructor}
	 */
	wrap(text: string, alreadyPresentIndentation = ''): WrapResult {
		const markers: number[] = []
		const tabLength = this.tabLength
		const length = text.length
		const indentsN = alreadyPresentIndentation + this.continuationIndent
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

/**
 * The return value of the main operation of this library ({@link TextWrapper.wrap wrapping texts}) would be of this
 * type.
 * Although the final output will be stored in {@linkcode wrappedText} and you regularly need this,
 * but there is also a more advanced output: {@linkcode markers}.
 */
export interface WrapResult {
	/**
	 * The final output. This would be as same as the your original input,
	 * but in addition to ***a few break-line characters* + *possibly indentations***
	 * (**`'\n' + calculated_indentations`**).
	 *
	 * @see <code>alreadyPresentIndentation</code> in {@linkcode TextWrapper.wrap.alreadyPresentIndentation wrap()}
	 *
	 * @see WrapOptions.continuationIndent
	 */
	wrappedText: string
	
	/**
	 * Each member of this array would point to a location that a *line-break* (possibly: *line-break + indentation*)
	 * is needed.
	 *
	 * So you can reproduce the final output ({@linkcode wrappedText}) completely using
	 * ***this array* + *your original input***.
	 */
	markers: number[]
}

/**
 * Preferences to pass to the {@link TextWrapper} constructor to control its behavior.
 * All choices are optional. See default values in {@link DEF_WRAP_OPTIONS}.
 */
export interface WrapOptions {
	/**
	 * This is the most useful option. It determines the maximum allowed length of each line. The words exceed this rule
	 * will go to the next line. There are some configurable options to say the program how does this work:
	 * 1. Allowed characters for exceeding the limitation (by default: white-spaces): {@link allowedExceedingCharacters}
	 * 2. Word-boundaries: {@link breakableCharacters}
	 * 3. Tab-character length: {@link tabLength}
	 * 4. The indents to be inserted in the leading of each newly created line: {@link continuationIndent}
	 */
	wrapOn?: number
	
	/**
	 * This determines the max-length that should be considered for tab-characters (`'\t'`). Notice that the length of
	 * each tab-character is depended on its location in its line. For example if this option is set to `4`, then the
	 * length of `'\tA'` will be appeared `5` and the length of `'A\t'` will be appeared `4`.
	 */
	tabLength?: number
	
	/**
	 * Long lines don't break at any where the length is exceeded. But it occurs only on word-boundaries by default.
	 * So this options has been set to `/[^\w\xA0]/` to be broken on any non-word character (`/^\w/ === /[^a-zA-Z0-9_]/`)
	 * except a special white-space character named *non-breakable space (`'\xA0'`)*.
	 *
	 * Note: This RegExp will be tested against only a single character (each time)!
	 */
	breakableCharacters?: RegExp
	
	/**
	 * This determines which characters are allowed to exceed the limitation (after {@link wrapOn} value). By default,
	 * this has been set to `/\s/` to allow any white-space character. new-line-character (`'\n'`) will be ignored,
	 * anyway.
	 *
	 * Note: This RegExp will be tested against only a single character (each time)!
	 */
	allowedExceedingCharacters?: RegExp
	
	/**
	 * This value will be added after each line-break (`'\n'`) character that this tool adds to the text. So it appears
	 * in the leading of each new line (not the already-present lines).
	 */
	continuationIndent?: string
}

export const DEF_WRAP_OPTIONS: WrapOptions = {
	wrapOn: 100,
	tabLength: 4,
	breakableCharacters: /[^\w\xA0]/,
	allowedExceedingCharacters: /\s/,
	continuationIndent: '',
}

export function wrapper(text: string, wrapOptions = DEF_WRAP_OPTIONS, alreadyPresentIndentation = ''): string {
	return new TextWrapper(wrapOptions).wrap(text, alreadyPresentIndentation).wrappedText
}
