// @flow

import moment from 'moment';
import { firebase } from './firebase.js';
import { log } from './logger.js';
import { userBackendFacade } from './user-backend.js';

type LastEmotionAnswer = {
    emotion: string,
    when: moment$Moment,
};

export class CurrentEmotionBackendFacade {
    registerCurrentEmotion(emotion: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const user = userBackendFacade.getUserOrThrow('registerCurrentEmotion');

            log.debug('Registering current emotion, %j', emotion);
            const path = 'user-data/' + user.uid + '/emotions';
            const toWrite = {
                emotion: emotion,
                when: moment().format('x'), // x is the unix timestamps in ms
            };

            firebase
                .database()
                .ref(path)
                .push(toWrite, thenableToPromise(resolve, reject));
        });
    }

    getLastEmotionAnswer(): Promise<?LastEmotionAnswer> {
        log.debug('Reading last recorded feeling');

        return new Promise(resolve => {
            const user = userBackendFacade.getUserOrThrow('getLastEmotionAnswer');

            firebase
                .database()
                .ref('user-data/' + user.uid + '/emotions')
                .orderByChild('when')
                .limitToLast(1)
                .once('value', snap => {
                    const firebaseWeirdValue = snap.val();
                    if (firebaseWeirdValue === null) {
                        resolve(null);
                    } else {
                        const firebaseWeirdKey = Object.keys(firebaseWeirdValue)[0];
                        const value = firebaseWeirdValue[firebaseWeirdKey];

                        resolve({
                            emotion: value.emotion,
                            when: moment(value.when, 'x'),
                        });
                    }
                });
        });
    }
}

export const currentEmotionBackendFacade = new CurrentEmotionBackendFacade();

function thenableToPromise(resolve, reject): (?Object) => void {
    return err => {
        if (err) {
            reject(err);
        } else {
            resolve();
        }
    };
}
