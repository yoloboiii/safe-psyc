// @flow

import { InteractionManager, Alert } from 'react-native';
import { sessionService } from './services/session-service.js';
import { AnswerService } from './services/answer-service.js'
import moment from 'moment';

import type { Question } from './models/questions.js';
import type { BackendFacade } from './services/backend.js';

export type Navigation<P> = {
    navigate: (string, ?Object) => void,
    state?: {
        params: P,
    },
}

export function startRandomSession(navigation: Navigation<*>, onDataLoaded?: ()=>void) {
    InteractionManager.runAfterInteractions(() => {
        const questions = sessionService.getRandomQuestions(20);
        const answers = questions.map(question => question.answer);
        onDataLoaded && onDataLoaded();
        navigation.navigate('Session', {
            questions: questions,
            answerService: new AnswerService(answers),
        });
    });
}

export function navigateToQuestionDetails(navigation: Navigation<*>, question: Question) {
    navigation.navigate('QuestionDetails', {
        question: question,
    });
}

export function onSessionFinished(navigation: Navigation<*>, backend: BackendFacade): Promise<*> {
    return backend.getLastFeelingAnswer()
        .then( answer => {
            const eightHoursAgo = moment().subtract(8, 'hours');
            const haveAlreadyAnswered = eightHoursAgo.isBefore(answer.when);

            return haveAlreadyAnswered;
        })
        .then( haveAlreadyAnswered => {
            const neverWantsToBeAsked = false; // TODO: implement this
            return {
                haveAlreadyAnswered,
                neverWantsToBeAsked,
            };
        })
        .then( context => {

            const { haveAlreadyAnswered, neverWantsToBeAsked } = context;
            const shouldAskHowTheUserIsFeeling = !haveAlreadyAnswered && !neverWantsToBeAsked;
            if (shouldAskHowTheUserIsFeeling) {
                navigation.navigate('CurrentFeeling');
            } else {
                navigation.navigate('HomeScreen');
            }
        })
        .catch(e => {
            console.log('UNABLE TO NAVIGATE!', e);
            Alert.alert( 'ERROR', 'Unable to navigate onSessionFinished.\n' + e);
        });
}
