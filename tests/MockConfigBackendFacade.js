// @flow

import type { ConfigBackendFacade } from '~/src/services/config-backend.js';
import type { Config } from '~/src/services/number-of-questions-service.js';


const defaultConfig: Config =  {
    numberOfQuestionsPerSession: 10,

    eyeQuestionsFactor: 8,
    intensityQuestionsFactor: 1,
    wordQuestionsFactor: 1,
};
export function newConfigBackendMock(config?: $Shape<Config>) {
    const concreteConfig = Object.assign({}, defaultConfig, config);

    const configMock: ConfigBackendFacade = ({
        getEyeQuestionsFactor: () => Promise.resolve(concreteConfig.eyeQuestionsFactor),
        getIntensityQuestionsFactor: () => Promise.resolve(concreteConfig.intensityQuestionsFactor),
        getWordQuestionsFactor: () => Promise.resolve(concreteConfig.wordQuestionsFactor),

        getNumberOfQuestionsPerSession: () => Promise.resolve(concreteConfig.numberOfQuestionsPerSession),
    }: any);

    return configMock;
}
