// @flow

import { InteractionManager } from 'react-native';

export function checkNextTick(done, check) {
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
