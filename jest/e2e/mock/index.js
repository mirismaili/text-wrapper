/**
 * @author [S. Mahdi Mir-Ismaili](https://mirismaili.github.io)
 * Created on 1398/3/3 (2019/5/24).
 */
'use strict'

import TextWrapper from '../../../dist/bundle.esm.js'

if (!(new TextWrapper() instanceof TextWrapper))
	throw new Error(`A problem in \`text_wrapper_lib.default\`:\n${text_wrapper_lib.default}`)
