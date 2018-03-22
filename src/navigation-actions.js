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



let navigation: ?Navigation<mixed> = null;
function safeNavigate() {
    if (navigation) return navigation;
    else throw new Error("Tried to navigate but the navigation handle was not set");
}
export function setNavigation(nav: Navigation<mixed>) {
    navigation = nav;
}

export function paramsOr<T, S>(navigation: Navigation<T>, or: S): T | S {
    return navigation.state && navigation.state.params ? navigation.state.params : or;
}

export function startRandomSession(onDataLoaded?: () => void): Promise<{}> {
    log.event("START_RANDOM_SESSION");
    return configBackendFacade.getNumberOfQuestionsPerSession().then(numQuestions => {
        return doStartRandomSession(numQuestions, onDataLoaded);
    });
}

function doStartRandomSession(numQuestions, onDataLoaded) {
    return new Promise(resolve => {
        InteractionManager.runAfterInteractions(() => {
            const questions = randomSessionService.getRandomQuestions(numQuestions);
            onDataLoaded && onDataLoaded();
            safeNavigate().navigate('Session', {
                questions: questions,
            });

            resolve();
        });
    });
}

export function navigateToEmotionDetails(emotion: Emotion) {
    safeNavigate().navigate('EmotionDetails', {
        emotion: emotion,
    });
}

export function navigateToSessionReport(report: Report) {
    safeNavigate().dispatch(
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

export function routeToCurrentFeelingOrHome(backend: CurrentEmotionBackendFacade): Promise<*> {
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
                safeNavigate().dispatch(resetAction);
            } else {
                resetToHome();
            }
        })
        .catch(e => {
            log.error('Unable to navigate onSessionFinished', e);
            Alert.alert('ERROR', 'Unable to navigate onSessionFinished.\n' + e);
        });
}

export function toResetPassword(email?: string) {
    safeNavigate().navigate('ResetPassword', {
        email: email,
    });
}

export function openSettings() {
    safeNavigate().navigate('Settings');
}

export function onUserRegistered(username: string) {
    safeNavigate().navigate('Welcome', {
        username: username,
    });
}

export function onUserLoggedIn() {
    resetToHome();
}

export function onUserLoggedOut(storage: * = AsyncStorage): Promise<void> {
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
            resetTo(route);
        });
}

export function resetTo(routeName: string) {
    safeNavigate().dispatch(
        NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: routeName })],
        })
    );
}

export function resetToHome() {
    resetTo('Home');
}

export function resetToLogin() {
    resetTo('Login');
}
