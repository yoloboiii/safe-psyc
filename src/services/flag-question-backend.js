// @flow

import { firebase } from './firebase.js';
import { userBackendFacade } from './user-backend.js';
import moment from 'moment';

import type { Question } from '../models/questions.js';

export class FlagQuestionBackendFacade {

    flagQuestion(question: Question): Promise<void> {
        const user = userBackendFacade.getUserOrThrow('flag-question');

        return firebase.
            database()
            .ref('user-data/' + user.uid + '/flagged-questions/' + question.correctAnswer.name)
            .push({
                type: question.type,
                when: moment().format('x'),
            });
    }
}

export const flagQuestionBackendFacade = new FlagQuestionBackendFacade();
