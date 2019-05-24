/**
 * @author [S. Mahdi Mir-Ismaili](https://mirismaili.github.io)
 * Created on 1398/3/3 (2019/5/24).
 */
'use strict'

import TextWrap from '../../../dist/bundle.esm.js'

if (!(new TextWrap() instanceof TextWrap))
	throw new Error(`A problem in \`textWrap.default\`:\n${textWrap.default}`)
