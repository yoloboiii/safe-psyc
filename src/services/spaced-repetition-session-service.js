// @flow

import moment from 'moment';
import { answerBackendFacade } from './answer-backend.js';
import { answerService } from './answer-service.js';
import { emotionService } from './emotion-service.js';
import { ReferencePointService } from './reference-point-service.js';
import { knuthShuffle } from 'knuth-shuffle';
import { generateEyeQuestion, generateIntensityQuestion } from '../utils/question-utils.js';

import type { Emotion } from '../models/emotion.js';
import type { Question, EyeQuestion, IntensityQuestion } from '../models/questions.js';
import type { AnswerBackendFacade } from './answer-backend.js';
import type { AnswerService } from './answer-service.js';
import type { EmotionService } from './emotion-service.js';

type Answer = {
    correct: boolean,
    when: moment$Moment,
};

export const beginningOfTime = moment('2000-01-01 00:00:00'); // close enough ¯\_(ツ)_/¯

export class SpacedRepetitionSessionService {

    _answerBackendFacade: AnswerBackendFacade;
    _answerService: AnswerService;
    _emotionService: EmotionService;
    _referencePointService: ReferencePointService;

    constructor(
        answerBackendFacade: AnswerBackendFacade,
        answerSrv: AnswerService,
        emotionSrv: EmotionService
    ){

        this._answerBackendFacade = answerBackendFacade;
        this._answerService = answerSrv;

        this._emotionService = emotionSrv;
        this._referencePointService = new ReferencePointService(this.getEmotionPool());

        this._answerService.setAnswerPool(this.getEmotionPool());
    }

    getQuestions(numQuestions: number): Promise<Array<Question>> {
        /*const minNumEye = Math.min(Math.floor(numQuestions / 2 + 1), numQuestions);
        const minNumIntensity = Math.floor(numQuestions * 0.3);
        const numEyeQuestions = Math.max(
            0,
            Math.floor(Math.random() * (numQuestions / 2 - minNumIntensity)) + minNumEye
        );
        const numIntensityQuestions = numQuestions - numEyeQuestions;
        */
        const numEyeQuestions = 2;
        const numIntensityQuestions = 1;

        return this._answerBackendFacade.getLastTwoAnswersToAllQuestions()
            .then( allAnswers => enhanceWithDueDates(allAnswers))
            .then( dueDates => sortByDueDate(dueDates))
            .then( dueDates => selectQuestions(dueDates, this.getEmotionPool()))
            .then( dueDates => {
                return dueDates.map(qi => {
                    switch(qi.questionType) {
                    case 'eye-question': return generateEyeQuestion(qi.emotion, this._answerService);
                    case 'intensity': return generateIntensityQuestion(qi.emotion, this._referencePointService);
                    default: throw new Error('Unknown question type: ', qi.questionType);
                    }
                });
            })
        //.then( questions => knuthShuffle(questions));
    }

    getEmotionPool(): Array<Emotion> {
        return this._emotionService.getEmotionPool();
    }
}

function enhanceWithDueDates(allAnswers: Map<string, *>): Array<*> {

    onst dueDates = [];
    allAnswers.forEach( answers => {
        if (answers.length < 1) return;

        const emotion = answers[0].emotion;
        const questionType = answers[0].questionType;

        const dueDate = calculateDueDate(answers);
        console.log(emotion.name, 'due date', dueDate);
        dueDates.push({ emotion, questionType, dueDate });
    })

    return dueDates;
}

export function calculateDueDate(lastTwoAnswersToOneEmotion: $ReadOnlyArray<Answer>): moment$Moment {
    const hasNotBeenAnswered = lastTwoAnswersToOneEmotion.length === 0;
    if (hasNotBeenAnswered) {
        return beginningOfTime;
    }

    const answersCopy = [...lastTwoAnswersToOneEmotion];
    const answersSortedByTimeDesc = answersCopy.sort((a, b) => {
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

function sortByDueDate(dueDates) {
    return dueDates.sort((a,b) => a.dueDate - b.dueDate);
}

function selectQuestions(dueDates, emotionPool) {
    const eyeQuestions = dueDates.filter(qi => qi.questionType === 'eye-question');
    const intensityQuestions = dueDates.filter(qi => qi.questionType === 'intensity');

    const numEyeQuestionsLeft = numEyeQuestions - eyeQuestions.length;
    const numIntensityQuestionsLeft = numIntensityQuestions - intensityQuestions.length;

    console.log(dueDates.map(qi => ({ emotion: qi.emotion.name, questionType: qi.questionType, dueDate: qi.dueDate})));

    return dueDates
        .concat(this._gief(numEyeQuestionsLeft, 'eye-question', dueDates, emotionPool))
        .concat(this._gief(numIntensityQuestionsLeft, 'intensity', dueDates, emotionPool));
}

function _gief(num, questionType, not, emotionPool) {
    const notNames = not.filter(qi => qi.questionType === questionType).map(qi => qi.emotion.name);

    const g = [];
    for (const emotion of emotionPool) {
        if (g.length >= num) break;
        if (notNames.includes(emotion.name)) continue;

        console.log(emotion.name, 'is not in', notNames);

        g.push({ emotion, questionType });
    }
    return g;
}

export const spacedRepetitionSessionService = new SpacedRepetitionSessionService(
    answerBackendFacade,
    answerService,
    emotionService
);
