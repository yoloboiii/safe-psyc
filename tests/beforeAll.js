// @flow

jest.mock('react-native-firebase', () => ({
    initializeApp: () => ({
        auth: () => ({
            onAuthStateChanged: () => {},
        }),
        database: () => {},
    }),
}));

require("./toHaveMatcher.js");
require("./duplicateMatcher.js");
require("./elementsOtherThanMatcher.js");
require("./containsStringMatcher.js");

import { answerService } from '../src/services/answer-service.js';
answerService.setAnswerPool(['aaaaaaaaaaa', 'bbbbbbbbbbb', 'ccccccc', 'ddddd', 'eeeeeeee']);
