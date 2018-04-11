// @flow

import moment from 'moment';
import { knuthShuffle } from 'knuth-shuffle';

import { answerService } from '~/src/services/answer-service.js';
import { emotionService } from '~/src/services/emotion-service.js';
import { ReferencePointService } from '~/src/services/reference-point-service.js';
import { generateEyeQuestion, generateIntensityQuestion } from '~/src/utils/question-utils.js';

import type { Emotion } from '~/src/models/emotion.js';
import type { Question, EyeQuestion, IntensityQuestion } from '~/src/models/questions.js';
import type { AnswerService } from '~/src/services/answer-service.js';
import type { EmotionService } from '~/src/services/emotion-service.js';

type Answer = {
    correct: boolean,
    when: moment$Moment,
};

export const beginningOfTime = moment('2000-01-01 00:00:00'); // close enough ¯\_(ツ)_/¯

export class SpacedRepetitionSessionService {
    _answerService: AnswerService;
    _emotionService: EmotionService;
    _referencePointService: ReferencePointService;

    constructor(answerService: AnswerService, emotionService: EmotionService) {
        this._answerService = answerService;

        this._emotionService = emotionService;
        this._referencePointService = new ReferencePointService(this.getEmotionPool());

        this._answerService.setAnswerPool(this.getEmotionPool());
    }

    getQuestions(numQuestions: number): Array<Question> {
        const minNumEye = Math.min(numQuestions / 2 + 1, numQuestions);
        const minNumIntensity = Math.floor(numQuestions * 0.3);
        const numEyeQuestions = Math.max(
            0,
            Math.floor(Math.random() * (numQuestions / 2 - minNumIntensity)) + minNumEye
        );
        const numIntensityQuestions = numQuestions - numEyeQuestions;

        const emotionsWithImage = [];
        const emotionsWithCoordinates = [];

        const questions = [];
        for (const emotion of emotionsWithImage) {
            questions.push(generateEyeQuestion(emotion, this._answerService));
        }

        for (const emotion of emotionsWithCoordinates) {
            questions.push(generateIntensityQuestion(emotion, this._referencePointService));
        }

        return knuthShuffle(questions);
    }

    getEmotionPool(): Array<Emotion> {
        return this._emotionService.getEmotionPool();
    }
}

export function calculateDueDate(lastTwoAnswersToOneEmotion: Array<Answer>): moment$Moment {
    const hasNotBeenAnswered = lastTwoAnswersToOneEmotion.length === 0;
    if (hasNotBeenAnswered) {
        return beginningOfTime;
    }

    const answersSortedByTimeDesc = lastTwoAnswersToOneEmotion.sort((a, b) => {
        // $FlowFixMe
        return b.when - a.when;
    });

    const lastAnswerWasIncorrect = !answersSortedByTimeDesc[0].correct;
    if (lastAnswerWasIncorrect) {
        return beginningOfTime;
    }

    // Coming here also means that the only answer was correct
    const hasBeenAnsweredExactlyOnce = lastTwoAnswersToOneEmotion.length === 1;
    if (hasBeenAnsweredExactlyOnce) {
        return moment(beginningOfTime).add(1, 'days');
    }

    const lastCorrectAnswerDate = answersSortedByTimeDesc[0].when;
    const secondLastCorrectAnswerDate = answersSortedByTimeDesc[1].when;

    // $FlowFixMe
    const lastIntervalMs = lastCorrectAnswerDate - secondLastCorrectAnswerDate;
    const msToAdd = lastIntervalMs * 1.2;

    return moment(lastCorrectAnswerDate).add(msToAdd, 'milliseconds');
}

export const spacedRepetitionSessionService = new SpacedRepetitionSessionService(
    answerService,
    emotionService
);
