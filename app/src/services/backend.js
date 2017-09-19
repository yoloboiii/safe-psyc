// @flow

import type { Question } from '../models/questions.js';

export class BackendFacade {

    registerCorrectAnswer(question: Question) {

    }

    registerIncorrectAnswer(question: Question, answer: string) {

    }

    registerCurrentEmotion(emotion: string) {

    }
}

export const backendFacade = new BackendFacade();
