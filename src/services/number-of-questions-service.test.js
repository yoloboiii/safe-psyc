// @flow

import { NumberOfQuestionsService } from './number-of-questions-service.js';
import { newConfigBackendMock } from '~/tests/MockConfigBackendFacade.js';
import type { Config } from './number-of-questions-service.js';

it('handles evenly divisable factors', () => {
    const service = serviceWithConfig({
        numberOfQuestionsPerSession: 10,

        eyeQuestionsFactor: 7,
        intensityQuestionsFactor: 2,
        wordQuestionsFactor: 1,
    });

    return service.getNumberOfQuestionsPerType()
        .then( result => {
            expect(result.eye).toEqual(7);
            expect(result.intensity).toEqual(2);
            expect(result.word).toEqual(1);
        });
});

it('fills not evenly factors with the largest factor type', () => {
    const service = serviceWithConfig({
        numberOfQuestionsPerSession: 12,

        eyeQuestionsFactor: 7,
        intensityQuestionsFactor: 2,
        wordQuestionsFactor: 1,
    });

    return service.getNumberOfQuestionsPerType()
        .then( result => {
            expect(result.eye).toEqual(9);
            expect(result.intensity).toEqual(2);
            expect(result.word).toEqual(1);
        });
});

it('zeroes question types if the number of questions is less than the number of types, one type has prio', () => {
    const service = serviceWithConfig({
        numberOfQuestionsPerSession: 2,

        eyeQuestionsFactor: 2,
        intensityQuestionsFactor: 1,
        wordQuestionsFactor: 1,
    });

    return service.getNumberOfQuestionsPerType()
        .then( result => {
            expect(result.eye).toEqual(2);
            expect(result.intensity).toEqual(0);
            expect(result.word).toEqual(0);
        });
})

it('zeroes question types if the number of questions is less than the number of types, all types equal', () => {
    const service = serviceWithConfig({
        numberOfQuestionsPerSession: 2,

        eyeQuestionsFactor: 1,
        intensityQuestionsFactor: 1,
        wordQuestionsFactor: 1,
    });

    // You might expect this to be more equal, such as two types getting one question each, but
    // that is more difficult and this is such an edge case anyway that I don't think it's worth
    // spending time on it
    return service.getNumberOfQuestionsPerType()
        .then( result => {
            expect(result.eye).toEqual(2);
            expect(result.intensity).toEqual(0);
            expect(result.word).toEqual(0);
        });
})


function serviceWithConfig(config: Config): NumberOfQuestionsService {
    return new NumberOfQuestionsService(newConfigBackendMock(config));
}
