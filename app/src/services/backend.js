// @flow

import type { Question } from '../models/questions.js';

type LastFeelingAnswer = {
    when: Date,
};
export class BackendFacade {

    registerCorrectAnswer(question: Question) {

    }

    registerIncorrectAnswer(question: Question, answer: string) {

    }

    registerCurrentEmotion(emotion: string) {

    }

    getLastFeelingAnswer(): Promise<LastFeelingAnswer> {
        return new Promise(r => {
            r({
                when: new Date(),
            });
        });
    }
}

export const backendFacade = new BackendFacade();
