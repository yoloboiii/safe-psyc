// @flow

import { InteractionManager } from 'react-native';

type Done = (?Error) => void;
type Check = () => void;

export function checknNextTick(done: Done, check: Check) {
    InteractionManager.runAfterInteractions(() => {
        try {
            check();
            done();
        } catch (e) {
            // $FlowFixMe
            done(e);
        }
    });
}

export function checkNextTick(check: Check): Promise<void> {
    return new Promise((resolve, reject) => {
        InteractionManager.runAfterInteractions(() => {
            try {
                check();
                resolve();
            } catch (e) {
                // $FlowFixMe
                reject(e);
            }
        });
    });
}

export function failFast(done: Done, check: Check) {
    InteractionManager.runAfterInteractions(() => {
        try {
            check();
        } catch (e) {
            // $FlowFixMe
            done(e);
        }
    });
}
