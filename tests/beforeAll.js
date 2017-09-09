// @flow

require("./toHaveMatcher.js");
require("./duplicateMatcher.js");
require("./elementsOtherThanMatcher.js");
require("./containsStringMatcher.js");

import { answerService } from '../src/services/answer-service.js';
if (answerService.poolSize() === 0) {
    answerService.setAnswerPool(['a', 'b', 'c', 'd', 'e']);
}
