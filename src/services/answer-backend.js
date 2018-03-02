// @flow

import moment from 'moment';
import { firebase } from './firebase.js';
import { log } from './logger.js';
import { userBackendFacade } from './user-backend.js';
import { randomSessionService } from './random-session-service.js';
import type { Question, AnswerType, IncorrectAnswer } from '../models/questions.js';
import type { Emotion } from '../models/emotion.js';

const db = firebase.database();

export class AnswerBackendFacade {
    registerCorrectAnswer(question: Question): Promise<void> {
        return new Promise((resolve, reject) => {
            const user = userBackendFacade.getUserOrThrow('registerCorrectAnswer');

            log.debug('Registering correct answer to %j', question.correctAnswer.name);
            const emotion = question.correctAnswer;
            const path = 'user-data/' + user.uid + '/correct-answers';
            const toWrite = {
                emotion: emotion.name,
                questionType: question.type,
                when: moment().format('x'), // x is the unix timestamps in ms
            };

            db.ref(path).push(toWrite, thenableToPromise(resolve, reject));
        });
    }

    registerIncorrectAnswer(question: Question, answer: AnswerType): Promise<void> {
        return new Promise((resolve, reject) => {
            const user = userBackendFacade.getUserOrThrow('registerIncorrectAnswer');

            const ansString = answer.name || answer.toString();

            log.debug(
                'Registering incorrect answer %s to %s',
                ansString,
                question.correctAnswer.name
            );
            const emotion = question.correctAnswer;
            const path = 'user-data/' + user.uid + '/incorrect-answers';
            const toWrite = {
                emotion: emotion.name,
                questionType: question.type,
                answer: ansString,
                when: moment().format('x'), // x is the unix timestamps in ms
            };

            db.ref(path).push(toWrite, thenableToPromise(resolve, reject));
        });
    }

    getAnswersTo(
        emotion: Emotion
    ): Promise<{
        correct: Array<moment$Moment>,
        incorrect: Array<IncorrectAnswer>,
    }> {
        const user = userBackendFacade.getUserOrThrow('getAnswersTo');

        // Get all correct answers
        const correctPromise = firebase
            .database()
            .ref('user-data/' + user.uid + '/correct-answers')
            .once('value')
            .then(snap => {
                const correctAnswers = [];
                snap.forEach(correctAnswer => {
                    const val = correctAnswer.val();
                    if (val.emotion === emotion.name) {
                        correctAnswers.push(moment(val.when, 'x'));
                    }

                    return false;
                });
                return correctAnswers;
            });

        const emotionLookupTable = new Map();
        randomSessionService.getEmotionPool().forEach(e => emotionLookupTable.set(e.name, e));
        // Get all incorrect answers
        const incorrectPromise = firebase
            .database()
            .ref('user-data/' + user.uid + '/incorrect-answers')
            .once('value')
            .then(snap => {
                const incorrectAnswers = [];
                snap.forEach(incorrectAnswer => {
                    const val = incorrectAnswer.val();
                    if (val.emotion === emotion.name) {
                        let answer = null;
                        if (isNumber(val.answer)) {
                            answer = parseFloat(val.answer);
                        } else {
                            answer = emotionLookupTable.get(val.answer);
                        }

                        incorrectAnswers.push({
                            answer: answer,
                            when: moment(val.when, 'x'),
                            questionType: val.questionType,
                        });
                    }

                    return false;
                });
                return incorrectAnswers;
            });

        return Promise.all([correctPromise, incorrectPromise])
            .then(results => {
                const correct = results[0];
                const incorrect = results[1];
                return {
                    correct,
                    incorrect,
                };
            })
            .catch(e => {
                log.error('Failed getting answers to %d, %j', emotion.name, e);
                throw e;
            });
    }
}

export const answerBackendFacade = new AnswerBackendFacade();

function thenableToPromise(resolve, reject): (?Object) => void {
    return err => {
        if (err) {
            reject(err);
        } else {
            resolve();
        }
    };
}

function isNumber(candidate) {
    return !isNaN(parseFloat(candidate)) && isFinite(candidate);
}
