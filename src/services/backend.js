// @flow

import moment from 'moment';
import { firebase } from './firebase.js';
import { sessionService } from './session-service.js';
import { log } from './logger.js';
import type { Question } from '../models/questions.js';
import type { Emotion } from '../models/emotion.js';

//////////////////////////////////////////////////////////
//////////////////// AUTH LISTENERS //////////////////////
//////////////////////////////////////////////////////////
let loggedInUser = null;
const onLoggedInListeners = [];
const onLoggedOutListeners = [];
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        log.debug('onAuthStateChange - user logged in');
        loggedInUser = user;

        onLoggedInListeners.forEach(l => l());
    } else {
        log.debug('onAuthStateChange - user logged out');
        loggedInUser = null;

        onLoggedOutListeners.forEach(l => l());
    }
});

const db = firebase.database();
type LastEmotionAnswer = {
    emotion: string,
    when: moment$Moment,
};
export class BackendFacade {

    registerCorrectAnswer(question: Question): Promise<void> {
        return new Promise((resolve, reject) => {
            const user = loggedInUser;
            if (!user) {
                const err = new Error('Unauthorized write attempt');
                log.error('Not logged in - registerCorrectAnswer, %j', err);
                throw err;
            }

            log.debug('Registering correct answer to, %j', question.correctAnswer.id);
            const emotion = question.correctAnswer;
            const path = 'user-data/' + user.uid + '/correct-answers';
            const toWrite = {
                emotion: emotion.id,
                when: moment().format('x'), // x is the unix timestamps in ms
            };

            db.ref(path).push(toWrite, thenableToPromise(resolve, reject));
        });
    }

    registerIncorrectAnswer(question: Question, answer: Emotion): Promise<void> {
        return new Promise((resolve, reject) => {
            const user = loggedInUser;
            if (!user) {
                const err = new Error('Unauthorized write attempt');
                log.error('Not logged in - registerIncorrectAnswer, %j', err);
                throw err;
            }

            log.debug('Registering incorrect answer %d to %d', answer.id, question.correctAnswer.id);
            const emotion = question.correctAnswer;
            const path = 'user-data/' + user.uid + '/incorrect-answers';
            const toWrite = {
                emotion: emotion.id,
                answer: answer.id,
                when: moment().format('x'), // x is the unix timestamps in ms
            };

            db.ref(path).push(toWrite, thenableToPromise(resolve, reject));
        });
    }

    registerCurrentEmotion(emotion: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const user = loggedInUser;
            if (!user) {
                const err = new Error('Unauthorized write attempt');
                log.error('Not logged in - registerCurrentEmotion, %j', err);
                throw err;
            }

            log.debug('Registering current emotion, %j', emotion);
            const path = 'user-data/' + user.uid + '/emotions';
            const toWrite = {
                emotion: emotion,
                when: moment().format('x'), // x is the unix timestamps in ms
            };

            db.ref(path).push(toWrite, thenableToPromise(resolve, reject));
        });
    }

    getEmotionWords(): Promise<Array<string>> {
        return new Promise((resolve) => {
            const emotions = ["Fear", "Anger", "Sadness", "Joy", "Disgust", "Surprise", "Trust", "Anticipation"];

            resolve(emotions);
        });
    }

    getLastEmotionAnswer(): Promise<LastEmotionAnswer> {
        log.debug('Reading last recorded feeling');
        return new Promise((resolve) => {
            const user = loggedInUser;
            if (!user) {
                const err = new Error('Unauthorized read attempt');
                log.error('Not logged in - getLastFeelingAnswer, %j', err);
                throw err;
            }

            firebase.database().ref('user-data/' + user.uid + '/emotions')
                .orderByChild('when')
                .limitToLast(1)
                .once('value', (snap) => {
                    const firebaseWeirdValue = snap.val();
                    const firebaseWeirdKey = Object.keys(firebaseWeirdValue)[0];
                    const value = firebaseWeirdValue[firebaseWeirdKey];

                    resolve({
                        emotion: value.emotion,
                        when: moment(value.when, 'x'),
                    });
                });
        });
    }

    getAnswersTo(emotion: Emotion): Promise<{ correct: Array<moment$Moment>, incorrect: Array<{ emotion: Emotion, when: moment$Moment}>}> {
            const user = loggedInUser;
            if (!user) {
                const err = new Error('Unauthorized read attempt');
                log.error('Not logged in - getAnswersTo, %j', err);
                throw err;
            }

            // Get all correct answers
            const correctPromise = firebase.database().ref('user-data/' + user.uid + '/correct-answers').once('value')
                .then( (snap) => {
                    const correctAnswers = [];
                    snap.forEach(correctAnswer => {
                        const val = correctAnswer.val();
                        if (val.emotion === emotion.id) {
                            correctAnswers.push(moment(val.when, 'x'));
                        }

                        return false;
                    });
                    return correctAnswers;
                });

            const emotionLookupTable = new Map();
            sessionService.getEmotionPool().forEach(e => emotionLookupTable.set(e.id, e));
            // Get all incorrect answers
            const incorrectPromise = firebase.database().ref('user-data/' + user.uid + '/incorrect-answers').once('value')
                .then( (snap) => {
                    const incorrectAnswers = [];
                    snap.forEach(incorrectAnswer => {
                        const val = incorrectAnswer.val();
                        if (val.emotion === emotion.id) {
                            incorrectAnswers.push({
                                // We only store the question id in the db,
                                // so we need to join in the real question
                                // objects.
                                emotion: emotionLookupTable.get(val.answer),
                                when: moment(val.when, 'x'),
                            });
                        }

                        return false;
                    });
                    return incorrectAnswers;
                });

            return Promise.all([correctPromise, incorrectPromise])
                .then( (results) => {
                    const correct = results[0];
                    const incorrect = results[1];
                    return {
                        correct,
                        incorrect,
                    };
                })
                .catch( e => {
                    log.error('Failed getting answers to %d, %j', emotion.id, e);
                    throw e;
                });
    }

    createNewUser(email: string, password: string): Promise<{email: string}> {
        email = email.trim();
        return firebase.auth().createUserWithEmailAndPassword(email, password)
            .then( (user) => {
                log.debug('Created user');
                return user;
            })
            .catch(function(error) {
                log.error('Failed creating user, %j', error);
                throw error;
            });
    }

    login(email: string, password: string): Promise<void> {
        return firebase.auth().signInWithEmailAndPassword(email, password)
            .then( function() {
                log.debug('Login successful');
            })
            .catch(function(error) {
                log.error('Failed logging in, %j', error);
                throw error;
            });
    }

    logOut(): Promise<void> {
        return firebase.auth().signOut()
            .then( () => {
                log.debug('User logged out');
            })
            .catch( e => {
                log.error('Failed logging out, %j', e);
                throw e;
            });
    }

    resetPassword(email: string): Promise<void> {
        return firebase.auth().sendPasswordResetEmail(email)
            .then( () => {
                log.debug('Password reset sent');
            })
            .catch( e => {
                log.error('Failed sending password reset, %j', e);
                throw e;
            });
    }

    onUserLoggedIn(callback: ()=>void) {
        onLoggedInListeners.push(callback);
    }

    onUserLoggedOut(callback: ()=>void) {
        onLoggedOutListeners.push(callback);
    }

    getLoggedInUser(): ?Object {
        return loggedInUser;
    }
}

export const backendFacade = new BackendFacade();

function thenableToPromise(resolve, reject): (?Object)=>void {
    return (err) => {
        if (err) {
            reject(err);
        } else {
            resolve();
        }
    };
}
