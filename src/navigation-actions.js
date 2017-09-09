// @flow

import { sessionService } from './services/session-service.js';

export type Navigation<P> = {
    navigate: (string, ?Object) => void,
    state?: {
        params: P,
    },
}

export function startRandomSession(navigation: Navigation<*>) {
    navigation.navigate('Session', {
        questions: sessionService.getRandomQuestions(20),
    });
}
