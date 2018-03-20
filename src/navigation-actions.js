// @flow

import { InteractionManager, Alert, AsyncStorage } from 'react-native';
import moment from 'moment';
// $FlowFixMe
import { NavigationActions } from 'react-navigation';
import { configBackendFacade } from './services/config-backend.js';
import { randomSessionService } from './services/random-session-service.js';
import { log } from './services/logger.js';

import type { Emotion } from './models/emotion.js';
import type { CurrentEmotionBackendFacade } from './services/current-emotion-backend.js';
import type { Report } from './components/session/report/SessionReport.js';

export type Navigation<P> = {
    navigate: (string, ?Object) => void,
    dispatch: Object => void,
    state?: {
        params: P,
    },
    addListener: ('willBlur'|'willFocus'|'didBlur'|'didFocus', () => void) => Subscription,
};

export type Subscription = {
    remove: () => void,
};

export function paramsOr<T, S>(navigation: Navigation<T>, or: S): T | S {
    return navigation.state && navigation.state.params ? navigation.state.params : or;
}

export function startRandomSession(
    navigation: Navigation<*>,
    onDataLoaded?: () => void
): Promise<{}> {
    log.event("START_RANDOM_SESSION");
    return configBackendFacade.getNumberOfQuestionsPerSession().then(numQuestions => {
        return doStartRandomSession(numQuestions, navigation, onDataLoaded);
    });
}

function doStartRandomSession(numQuestions, navigation, onDataLoaded) {
    return new Promise(resolve => {
        InteractionManager.runAfterInteractions(() => {
            const questions = randomSessionService.getRandomQuestions(numQuestions);
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

export function navigateToSessionReport(navigation: Navigation<*>, report: Report) {
    navigation.dispatch(
        NavigationActions.reset({
            index: 1,
            actions: [
                NavigationActions.navigate({ routeName: 'Home' }),
                NavigationActions.navigate({
                    routeName: 'SessionReport',
                    params: {
                        report: report,
                    },
                }),
            ],
        })
    );
}

export function routeToCurrentFeelingOrHome(
    navigation: Navigation<*>,
    backend: CurrentEmotionBackendFacade
): Promise<*> {
    return backend
        .getLastEmotionAnswer()
        .then(answer => {
            if (answer) {
                const eightHoursAgo = moment().subtract(8, 'hours');
                const haveAlreadyAnswered = eightHoursAgo.isBefore(answer.when);

                return haveAlreadyAnswered;
            } else {
                return false;
            }
        })
        .then(haveAlreadyAnswered => {
            const neverWantsToBeAsked = false; // TODO: implement this
            return {
                haveAlreadyAnswered,
                neverWantsToBeAsked,
            };
        })
        .then(context => {
            const { haveAlreadyAnswered, neverWantsToBeAsked } = context;
            const shouldAskHowTheUserIsFeeling = !haveAlreadyAnswered && !neverWantsToBeAsked;

            if (shouldAskHowTheUserIsFeeling) {
                const resetAction = NavigationActions.reset({
                    index: 1,
                    actions: [
                        NavigationActions.navigate({ routeName: 'Home' }),
                        NavigationActions.navigate({
                            routeName: 'CurrentFeeling',
                            params: {
                                skippable: true,
                            },
                        }),
                    ],
                });
                navigation.dispatch(resetAction);
            } else {
                resetToHome(navigation);
            }
        })
        .catch(e => {
            log.error('Unable to navigate onSessionFinished', e);
            Alert.alert('ERROR', 'Unable to navigate onSessionFinished.\n' + e);
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

export function onUserRegistered(navigation: Navigation<*>, username: string) {
    navigation.navigate('Welcome', {
        username: username,
    });
}

export function onUserLoggedIn(navigation: Navigation<*>) {
    resetToHome(navigation);
}

export function onUserLoggedOut(
    navigation: Navigation<*>,
    storage: * = AsyncStorage
): Promise<void> {
    return storage
        .getItem('hasSeenThePitch')
        .then(hasSeenThePitch => {
            if (hasSeenThePitch === 'true') {
                return 'Login';
            } else {
                return 'Pitch';
            }
        })
        .catch(e => {
            log.warn('Failed reading async storage: %s', e);
            return 'Pitch';
        })
        .then(route => {
            resetTo(navigation, route);
        });
}

export function resetTo(navigation: Navigation<*>, routeName: string) {
    navigation.dispatch(
        NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: routeName })],
        })
    );
}

export function resetToHome(navigation: Navigation<*>) {
    resetTo(navigation, 'Home');
}

export function resetToLogin(navigation: Navigation<*>) {
    resetTo(navigation, 'Login');
}
