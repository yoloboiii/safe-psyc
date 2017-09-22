// @flow

import firebase from 'firebase';
import { firebaseApp } from '../services/firebase.js';
import moment from 'moment';
import type { Question } from '../models/questions.js';

const db = firebaseApp.database();
let signedInUser = null;
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log('User signed in');
        signedInUser = user;
    } else {
        console.log('User signed out');
        signedInUser = null;
    }
});

type LastFeelingAnswer = {
    when: Date,
};
export class BackendFacade {

    createNewUser(email: string, password: string): Promise<void> {
        return firebase.auth().createUserWithEmailAndPassword(email, password)
            .then( () => {
                console.log('Created user', email);
            })
            .catch(function(error) {
                console.log('Failed creating user', email, error);
            });
    }

    login(email: string, password: string): Promise<void> {
        return firebase.auth().signInWithEmailAndPassword(email, password)
            .then( function() {
                console.log('Login as', email, 'successful');
            })
            .catch(function(error) {
                console.log('Failed logging in as', email, error);
            });
    }

    registerCorrectAnswer(question: Question): Promise<void> {
        return new Promise((resolve, reject) => {
            const user = signedInUser;
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
                when: moment().subtract(8, 'days'),
            });
        });
    }
}

export const backendFacade = new BackendFacade();

function thenableToPromise(resolve, reject): (Function)=>void {
    return (err) => {
        if (err) {
            reject(err);
        } else {
            resolve();
        }
    };
}
