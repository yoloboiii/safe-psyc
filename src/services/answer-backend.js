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
            const path = 'user-data/' + user.uid + '/answers/' + emotion.name;

            const toWrite = {
                correct: true,
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
            const path = 'user-data/' + user.uid + '/answers/' + emotion.name;
            const toWrite = {
                correct: false,
                questionType: question.type,
                answer: ansString,
                when: moment().format('x'), // x is the unix timestamps in ms
            };

            db.ref(path).push(toWrite, thenableToPromise(resolve, reject));
        });
    }

    getAnswersTo(emotion: Emotion): Promise<{
        correct: Array<moment$Moment>,
        incorrect: Array<IncorrectAnswer>,
    }> {
        return new Promise((resolve, reject) => {
            const user = userBackendFacade.getUserOrThrow('getAnswersTo');

            const emotionLookupTable = createEmotionLookupTable();
            const correct = [];
            const incorrect = [];

            return firebase
                .database()
                .ref('user-data/' + user.uid + '/answers/' + emotion.name)
                .once('value')
                .then( answersSnap => {
                    answersSnap.forEach(answerRef => {
                        const val = answerRef.val();

                        if (val.correct) {
                            correct.push(dbTimeToMoment(val.when));

                        } else {

                            incorrect.push(
                                dbObjToIncorrectAnswer(val, emotionLookupTable)
                            );
                        }
                    });

                    return { correct, incorrect };
                })
                .then(resolve)
                .catch(reject);
        });
    }

    getAllAnswers(): Promise<Map<string, { correct: boolean, when: moment$Moment }>> {

        return new Promise((resolve, reject) => {
            const user = userBackendFacade.getUserOrThrow('getAnswersTo');

            const emotionLookupTable = createEmotionLookupTable();
            const answers = new Map();

            return firebase
                .database()
                .ref('user-data/' + user.uid + '/answers')
                .once('value')
                .then( emotionsSnap => {
                    emotionsSnap.forEach(emotionSnap => {
                        const emotionName = emotionSnap.key;
                        const answersRef = emotionSnap.ref;

                        if (!answers.has(emotionName)) {
                            answers.set(emotionName, []);
                        }

                        answersRef
                            .once('value')
                            .then( answerSnap => {
                                answerSnap.forEach(answerRef => {
                                    const answer = answerRef.val();
                                    const when = dbTimeToMoment(answer.when);

                                    // $FlowFixMe: Guaranteed non-null by it being set above
                                    answers.get(emotionName).push({
                                        correct: answer.correct,
                                        when,
                                    });
                                })
                            });
                    });

                    return answers;
                })
                .then(resolve)
                .catch(reject);
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

function createEmotionLookupTable(): Map<string, Emotion> {
    // The incorrect answers in the database only contain the name of the emotion
    // the user answered, not the whole emotion object. This map resolves that reference.
    const emotionLookupTable = new Map();
    randomSessionService.getEmotionPool().forEach(e => emotionLookupTable.set(e.name, e));

    return emotionLookupTable;
}

function dbTimeToMoment(dbTime): moment$Moment {
    return moment(dbTime, 'x');
}

function dbObjToIncorrectAnswer(dbObj, emotionLookupTable): IncorrectAnswer {

    if (dbObj.questionType === 'intensity') {

        if (!isNumber(dbObj.answer)) {
            throw new Error('intensity answer was not a number: ' + dbObj.answer);
        }

        return {
            questionType: 'intensity',
            answer: parseFloat(dbObj.answer),
            when: dbTimeToMoment(dbObj.when),
        };
    }

    if (dbObj.questionType === 'eye-question') {

        const answer = emotionLookupTable.get(dbObj.answer);
        if(!answer) {
            throw new Error('Unable to resolve db answer to an emotion object: ' + dbObj.answer);
        }

        return {
            questionType: 'eye-question',
            answer,
            when: dbTimeToMoment(dbObj.when),
        };
    }

    throw new Error('Unknown question type: ' + dbObj.questionType);
}


function isNumber(candidate) {
    return !isNaN(parseFloat(candidate)) && isFinite(candidate);
}
