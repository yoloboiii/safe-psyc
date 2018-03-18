// @flow

import { InteractionManager } from 'react-native';

type Done = (?Error) => void;
type Check = () => void;

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

