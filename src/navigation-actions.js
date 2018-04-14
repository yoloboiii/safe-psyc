// @flow

import { InteractionManager, Alert, AsyncStorage } from 'react-native';
import moment from 'moment';
// $FlowFixMe
import { NavigationActions } from 'react-navigation';
import { randomSessionService } from '~/src/services/random-session-service.js';
import { log } from '~/src/services/logger.js';

import type { Emotion } from '~/src/models/emotion.js';
import type { CurrentEmotionBackendFacade } from '~/src/services/current-emotion-backend.js';
import type { Report } from '~/src/components/session/report/SessionReport.js';

export type Navigation<P> = {
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
function safeNavigation() {
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
    return new Promise(resolve => {
        InteractionManager.runAfterInteractions(() => {

            randomSessionService.getRandomQuestions()
                .then( questions => {
                    onDataLoaded && onDataLoaded();
                    navigate('Session', {
                        questions: questions,
                    });

                    resolve();
                });
        });
    });
}

function navigate(routeName: string, params?: Object) {
    safeNavigation().dispatch(
        NavigationActions.navigate({ routeName, params }),
    );
}

export function navigateToEmotionDetails(emotion: Emotion) {
    navigate('EmotionDetails', {
        emotion: emotion,
    });
}

export function navigateToSessionReport(report: Report) {
    safeNavigation().dispatch(
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
                safeNavigation().dispatch(resetAction);
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
    navigate('ResetPassword', {
        email: email,
    });
}

export function openSettings() {
    navigate('Settings');
}

export function onUserRegistered() {
    navigate('Welcome');
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
    safeNavigation().dispatch(
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

export function navigateToEmailLogIn() {
    navigate('EmailAuth', {
        primaryAction: 'login',
    });
}

export function navigateToRegister() {
    navigate('EmailAuth', {
        primaryAction: 'register',
    });
}

export function UNSAFE_navigateTo(screen: string, params?: Object) {
    navigate(screen, params);
}
