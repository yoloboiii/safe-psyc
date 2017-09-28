// @flow

import { InteractionManager, Alert } from 'react-native';
import moment from 'moment';
// $FlowFixMe
import { NavigationActions } from 'react-navigation';
import { sessionService } from './services/session-service.js';
import { log } from './services/logger.js';

import type { Emotion } from './models/emotion.js';
import type { BackendFacade } from './services/backend.js';

export type Navigation<P> = {
    navigate: (string, ?Object) => void,
    dispatch: (Object) => void,
    state?: {
        params: P,
    },
}

export function startRandomSession(navigation: Navigation<*>, onDataLoaded?: ()=>void): Promise<{}> {
    return new Promise( resolve => {
        InteractionManager.runAfterInteractions(() => {
            const questions = sessionService.getRandomQuestions(10);
            onDataLoaded && onDataLoaded();
            navigation.navigate('Session', {
                questions: questions,
            });

            resolve();
        });
    });
}

export function navigateToEmotionDetails(navigation: Navigation<*>, emotion: Emotion) {
    navigation.navigate('EmotionDetails', {
        emotion: emotion,
    });
}

export function onSessionFinished(navigation: Navigation<*>, backend: BackendFacade): Promise<*> {
    return backend.getLastEmotionAnswer()
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
                const resetAction = NavigationActions.reset({
                    index: 1,
                    actions: [
                        NavigationActions.navigate({ routeName: 'Home' }),
                        NavigationActions.navigate({ routeName: 'CurrentFeeling', params: {
                            skippable: true,
                        }}),
                    ],
                });
                navigation.dispatch(resetAction);
            } else {
                const resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'Home' }),
                    ],
                });
                navigation.dispatch(resetAction);
            }
        })
        .catch(e => {
            log.error('Unable to navigate onSessionFinished', e);
            Alert.alert( 'ERROR', 'Unable to navigate onSessionFinished.\n' + e);
        });
}

export function toResetPassword(navigation: Navigation<*>, email?: string) {
    navigation.navigate('ResetPassword', {
        email: email,
    });
}

export function openSettings(navigation: Navigation<*>) {
    navigation.navigate('Settings');
}

export function onUserLoggedIn(navigation: Navigation<*>) {
    resetToHome(navigation);
}

export function onUserLoggedOut(navigation: Navigation<*>) {
    navigation.dispatch(
        NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'Login' })
            ],
        })
    );
}

export function resetToHome(navigation: Navigation<*>) {
    navigation.dispatch(
        NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'Home' }),
            ],
        })
    );
}
