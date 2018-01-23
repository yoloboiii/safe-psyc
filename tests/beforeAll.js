// @flow

jest.mock('react-native-firebase', () => ({
    initializeApp: () => ({
        auth: () => ({
            onAuthStateChanged: () => {},
        }),
        database: () => {},
        crash: () => ({
            log: () => {},
            report: () => {},
        }),
    }),
}));

jest.mock('react-navigation', () => ({
    NavigationActions: {
        reset: (obj) => obj,
        navigate: (obj) => obj,
    },
}));

jest.mock('../src/services/logger', () => {

    const log = {
        debug: jest.fn(),
        warn: jest.fn(),
    };
    return {
        log: log,
        Logger: () => log,
    };
});

require("./toHaveMatcher.js");
require("./duplicateMatcher.js");
require("./elementsOtherThanMatcher.js");
require("./containsStringMatcher.js");
require("./navigationMatcher.js");

import { randomEmotions } from './emotion-utils.js';
import { answerService } from '../src/services/answer-service.js';
answerService.setAnswerPool(randomEmotions(5));
