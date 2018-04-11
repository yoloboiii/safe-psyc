// @flow

jest.mock('react-native-firebase', () => ({
    app: () => ({
        auth: () => ({
            onAuthStateChanged: () => {},
        }),
        database: () => {},
        crashlytics: () => {},
        analytics: () => ({
            setAnalyticsCollectionEnabled: () => {},
        }),
        config: () => ({
            getValue: () => Promise.resolve({
                val: () => {},
            }),
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
        error: jest.fn(),
        event: jest.fn(),
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
require("./momentMatcher.js");

import { randomEmotions } from './emotion-utils.js';
import { answerService } from '../src/services/answer-service.js';
answerService.setAnswerPool(randomEmotions(5));
