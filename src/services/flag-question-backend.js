// @flow

import moment from 'moment';

import { firebase } from '~/src/services/firebase.js';
import { userBackendFacade } from '~/src/services/user-backend.js';

import type { Question } from '~/src/models/questions.js';

export class FlagQuestionBackendFacade {

    flagQuestion(question: Question): Promise<string> {
        return userBackendFacade.getUserOrReject('flag-question')
            .then( user => {

                const path = 'user-data/'
                    + user.uid
                    + '/flagged-questions/'
                    + question.correctAnswer.name;

                const toWrite = {
                    type: question.type,
                    when: moment().format('x'),
                };

                const ref = firebase
                    .database()
                    .ref(path)
                    .push();

                return new Promise((resolve, reject) => {
                    ref.set(
                        toWrite,
                        (error) => error
                            ? reject(error)
                            : resolve(ref.key)
                    );
                });
        });
    }

    unflagQuestion(question: Question, id: string): Promise<void> {
        return userBackendFacade.getUserOrReject('unflag-question')
            .then( user => {
                const path = 'user-data/'
                    + user.uid
                    + '/flagged-questions/'
                    + question.correctAnswer.name
                    + '/'
                    + id;

                return firebase
                    .database()
                    .ref(path)
                    .remove();
            });
    }
}

export const flagQuestionBackendFacade = new FlagQuestionBackendFacade();
