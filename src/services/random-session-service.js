// @flow

import { knuthShuffle } from 'knuth-shuffle';

import { answerService } from '~/src/services/answer-service.js';
import { emotionService } from '~/src/services/emotion-service.js';
import { numberOfQuestionsService } from '~/src/services/number-of-questions-service.js';
import { ReferencePointService } from '~/src/services/reference-point-service.js';
import { generateEyeQuestion, generateIntensityQuestion, generateWordQuestion } from '~/src/utils/question-utils.js';

import type { Emotion } from '~/src/models/emotion.js';
import type { Question, EyeQuestion, IntensityQuestion, WordQuestion } from '~/src/models/questions.js';
import type { AnswerService } from '~/src/services/answer-service.js';
import type { EmotionService } from '~/src/services/emotion-service.js';
import type { NumberOfQuestionsService } from '~/src/services/number-of-questions-service.js';

export class RandomSessionService {
    _answerService: AnswerService;
    _emotionService: EmotionService;
    _referencePointService: ReferencePointService;
    _numQuestionsService: NumberOfQuestionsService;

    constructor(
        answerService: AnswerService,
        emotionService: EmotionService,
        numQuestionsService: NumberOfQuestionsService,
    ) {
        this._answerService = answerService;

        this._emotionService = emotionService;
        this._referencePointService = new ReferencePointService(this.getEmotionPool());

        this._numQuestionsService = numQuestionsService;

        this._answerService.setAnswerPool(this.getEmotionPool());
    }

    getRandomQuestions(): Promise<Array<Question>> {
        return this._numQuestionsService.getNumberOfQuestionsPerType()
            .then( nums => {
                const {
                    eye,
                    intensity,
                    word,
                } = nums;

                const questions = [
                    ...this._getEyeQuestions(eye),
                    ...this._getIntensityQuestions(intensity),
                    ...this._getWordQuestions(word),
                ];

                return knuthShuffle(questions);
            });
    }

    getEmotionPool(): Array<Emotion> {
        return this._emotionService.getEmotionPool();
    }

    _getEyeQuestions(numEyeQuestions): Array<EyeQuestion> {
        return getRandomElementsFromArray(
                numEyeQuestions,
                this.getEmotionPool().filter(e => !!e.image)
            )
            .map( emotion => generateEyeQuestion(emotion, this._answerService));
    }

    _getIntensityQuestions(numIntensityQuestions): Array<IntensityQuestion> {
        const questions = [];
        const emotionsWithCoordinates = knuthShuffle(this.getEmotionPool().filter(e => !!e.coordinates));

        for (let i=0; i<emotionsWithCoordinates.length && questions.length < numIntensityQuestions; i++) {
            const { question, isValid } = generateIntensityQuestion(
                emotionsWithCoordinates[i],
                this._referencePointService,
            );

            if (isValid) {
                questions.push(question);
            }
        }

        return questions;
    }

    _getWordQuestions(numWordQuestions): Array<WordQuestion> {
        return getRandomElementsFromArray(numWordQuestions, this.getEmotionPool())
            .map(emotion => generateWordQuestion(emotion, this._answerService));
    }
}

function getRandomElementsFromArray<T>(numElements: number, array: Array<T>): Array<T> {
    const poolCopy = array.slice();

    const elements = [];
    for (let i = 0; i < numElements && poolCopy.length > 0; i++) {
        const rnd = Math.floor(Math.random() * poolCopy.length);

        elements.push(poolCopy[rnd]);

        poolCopy.splice(rnd, 1);
    }

    return elements;
}

export const randomSessionService = new RandomSessionService(
    answerService,
    emotionService,
    numberOfQuestionsService,
);
