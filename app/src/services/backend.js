// @flow

import firebase from 'firebase';
import { firebaseApp } from '../services/firebase.js';
import moment from 'moment';
import type { Question } from '../models/questions.js';

const db = firebaseApp.database();
let signedInUser = null;
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        signedInUser = user;
    } else {
        // User is signed out.
        signedInUser = null;
    }
});

type LastFeelingAnswer = {
    when: Date,
};
export class BackendFacade {

    registerCorrectAnswer(question: Question): Promise<void> {
        return new Promise((resolve, reject) => {
            const user = signedInUser;
            if (!user) {
                const err = new Error('Unauthorized write attempt');
                logUnauthAttempt(err);
                throw err;
            }

            const path = 'user-data/' + user.uid + '/correct-answers';
            const toWrite = {
                question: question.id,
                when: moment(),
            };
            db.ref(path).push(toWrite, thenableToPromise(resolve, reject));
        });
    }

    registerIncorrectAnswer(question: Question, answer: string): Promise<void> {
        return new Promise((resolve) => {
            resolve();
        });
    }

    registerCurrentEmotion(emotion: string): Promise<void> {
        return new Promise((resolve) => {
            resolve();
        });
    }

    getLastFeelingAnswer(): Promise<LastFeelingAnswer> {
        return new Promise((resolve) => {
            resolve({
                when: new Date(),
            });
        });
    }
}

export const backendFacade = new BackendFacade();
function logUnauthAttempt(e) {
    console.log('UNAUTHORIZED ATTEMPT', e);
}

function thenableToPromise(resolve, reject): (Function)=>void {
    return (err) => {
        if (err) {
            reject(err);
        } else {
            resolve();
        }
    };
}
