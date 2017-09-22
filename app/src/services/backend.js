// @flow

import firebase from 'firebase';
import { firebaseApp } from '../services/firebase.js';
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

    registerCorrectAnswer(question: Question) {
        if (!signedInUser) {
            logUnauthAttempt(new Error());
        }

        question.id = 1;
        db.ref('correct-question-answers/').push({ user: signedInUser.uid, question: question.id });
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
function logUnauthAttempt(e) {
    console.log('UNAUTHORIZED ATTEMPT', e);
    throw e;
}
