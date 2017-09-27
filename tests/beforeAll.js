// @flow

jest.mock('react-native-firebase', () => ({
    initializeApp: () => ({
        auth: () => ({
            onAuthStateChanged: () => {},
        }),
        database: () => {},
        crash: () => {},
    }),
}));

require("./toHaveMatcher.js");
require("./duplicateMatcher.js");
require("./elementsOtherThanMatcher.js");
require("./containsStringMatcher.js");

import { randomEmotions } from './emotion-utils.js';
import { answerService } from '../src/services/answer-service.js';
answerService.setAnswerPool(randomEmotions(5));
