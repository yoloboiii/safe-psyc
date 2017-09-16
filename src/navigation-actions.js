// @flow

import { sessionService } from './services/session-service.js';
import { AnswerService } from './services/answer-service.js'

import type { Question } from './models/questions.js';

export type Navigation<P> = {
    navigate: (string, ?Object) => void,
    state?: {
        params: P,
    },
}

export function startRandomSession(navigation: Navigation<*>, onDataLoaded?: ()=>void) {
    const questions = sessionService.getRandomQuestions(20);
    const answers = questions.map(question => question.answer);
    onDataLoaded && onDataLoaded();
    navigation.navigate('Session', {
        questions: questions,
        answerService: new AnswerService(answers),
    });
}

export function navigateToQuestionDetails(navigation: Navigation<*>, question: Question) {
    navigation.navigate('QuestionDetails', {
        question: question,
    });
}

export function onSessionFinished(navigation: Navigation<*>) {
    const haveAlreadyAnswered = false; // TODO: implement this
    const neverWantsToBeAsked = false; // TODO: implement this

    const shouldAskHowTheUserIsFeeling = !haveAlreadyAnswered && !neverWantsToBeAsked;

    if (shouldAskHowTheUserIsFeeling) {
        navigation.navigate('CurrentFeeling');
    } else {
        navigation.navigate('HomeScreen');
    }
}
