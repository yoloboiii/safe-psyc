// @flow

import RNfirebase from 'react-native-firebase';
//import firebase from '../../tests/firebase-mock.js';
import moment from 'moment';
import { sessionService} from './session-service.js';
import type { Question } from '../models/questions.js';

const firebase = RNfirebase.initializeApp({
    debug: true,
    persistence: true,
});
//////////////////////////////////////////////////////////
//////////////////// AUTH LISTENERS //////////////////////
//////////////////////////////////////////////////////////
let loggedInUser = null;
const onLoggedInListeners = [];
const onLoggedOutListeners = [];
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log('User logged in');
        loggedInUser = user;

        onLoggedInListeners.forEach(l => l());
    } else {
        console.log('User logged out');
        loggedInUser = null;

        onLoggedOutListeners.forEach(l => l());
    }
});

const db = firebase.database();
type LastFeelingAnswer = {
    emotion: string,
    when: moment$Moment,
};
export class BackendFacade {

    registerCorrectAnswer(question: Question): Promise<void> {
        return new Promise((resolve, reject) => {
            const user = loggedInUser;
            if (!user) {
                const err = new Error('Unauthorized write attempt');
                console.log(err);
                throw err;
            }

            console.log('Registering correct answer to', question.id);
            const path = 'user-data/' + user.uid + '/correct-answers';
            const toWrite = {
                question: question.id,
                when: moment().format('x'), // x is the unix timestamps in ms
            };

            db.ref(path).push(toWrite, thenableToPromise(resolve, reject));
        });
    }

    registerIncorrectAnswer(question: Question, answer: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const user = loggedInUser;
            if (!user) {
                const err = new Error('Unauthorized write attempt');
                console.log(err);
                throw err;
            }

            console.log('Registering incorrect answer', answer, 'to', question.id);
            const path = 'user-data/' + user.uid + '/incorrect-answers';
            const toWrite = {
                question: question.id,
                answer: answer,
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
                console.log(err);
                throw err;
            }

            console.log('Registering current emotion', emotion);
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

    getLastFeelingAnswer(): Promise<LastFeelingAnswer> {
        console.log('Reading last recorded feeling');
        return new Promise((resolve) => {
            const user = loggedInUser;
            if (!user) {
                const err = new Error('Unauthorized read attempt');
                console.log(err);
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

    getAnswersTo(question: Question): Promise<{ correct: Array<moment$Moment>, incorrect: Array<{ question: Question, when: moment$Moment}>}> {
            const user = loggedInUser;
            if (!user) {
                const err = new Error('Unauthorized read attempt');
                console.log(err);
                throw err;
            }

            // Get all correct answers
            const correctPromise = firebase.database().ref('user-data/' + user.uid + '/correct-answers').once('value')
                .then( (snap) => {
                    const correctAnswers = [];
                    snap.forEach(correctAnswer => {
                        const val = correctAnswer.val();
                        if (val.question === question.id) {
                            correctAnswers.push(moment(val.when, 'x'));
                        }

                        return false;
                    });
                    return correctAnswers;
                });

            // Store all questions in a string: Question map
            const questionLookupTable = new Map();
            sessionService.getQuestionPool().forEach(question => questionLookupTable.set(question.answer, question));

            // Get all incorrect answers
            const incorrectPromise = firebase.database().ref('user-data/' + user.uid + '/incorrect-answers').once('value')
                .then( (snap) => {
                    const incorrectAnswers = [];
                    snap.forEach(incorrectAnswer => {
                        const val = incorrectAnswer.val();
                        if (val.question === question.id) {
                            incorrectAnswers.push({
                                // We only store the question id in the db,
                                // so we need to join in the real question
                                // objects.
                                question: questionLookupTable.get(val.answer),
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
                    console.log('Failed getting answers to', question, e);
                    throw e;
                });
    }

    createNewUser(email: string, password: string): Promise<void> {
        return firebase.auth().createUserWithEmailAndPassword(email, password)
            .then( () => {
                console.log('Created user', email);
            })
            .catch(function(error) {
                console.log('Failed creating user', email, error);
                throw error;
            });
    }

    login(email: string, password: string): Promise<void> {
        return firebase.auth().signInWithEmailAndPassword(email, password)
            .then( function() {
                console.log('Login as', email, 'successful');
            })
            .catch(function(error) {
                console.log('Failed logging in as', email, error);
                throw error;
            });
    }

    logOut(): Promise<void> {
        return firebase.auth().signOut()
            .then( () => {
                console.log('User logged out');
            })
            .catch( e => {
                console.log('Failed logging out', e);
                throw e;
            });
    }

    resetPassword(email: string): Promise<void> {
        return firebase.auth().sendPasswordResetEmail(email)
            .then( () => {
                console.log('Password reset sent to', email);
            })
            .catch( e => {
                console.log('Failed sending password reset to', email, e);
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
        console.log('HERP', err);
        if (err) {
            reject(err);
        } else {
            resolve();
        }
    };
}
