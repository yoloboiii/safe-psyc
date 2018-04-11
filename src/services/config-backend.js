// @flow

import { firebase } from '~/src/services/firebase.js';
import { log } from '~/src/services/logger.js';

export class ConfigBackendFacade {
    load(): Promise<void> {
        this._enableDevMode();
        this._setDefaults();
        return this._fetch();
    }

    _enableDevMode() {
        if (__DEV__) {
            log.debug('Enabling firebase remote config developer mode');
            firebase.config().enableDeveloperMode();
        }
    }

    _setDefaults() {
        firebase.config().setDefaults(this._getDefaults());
    }

    _getDefaults() {
        return {
            numQuestionsPerSession: 10,
        };
    }

    _fetch() {
        return firebase
            .config()
            .fetch()
            .then(() => {
                return firebase.config().activateFetched();
            })
            .then(activated => {
                if (activated) {
                    log.info('Updated the remote config!');
                } else {
                    log.debug('The remote config was not updated');
                }
            });
    }

    getNumberOfQuestionsPerSession(): Promise<number> {
        return this._getValue('numQuestionsPerSession').then(rawNumber => {
            const n = Number(rawNumber);
            if (Number.isNaN(n)) {
                log.warn(
                    "Unable to parse number of questions per session, '%s' was not a number",
                    rawNumber
                );

                return this._getDefaults().numQuestionsPerSession;
            }

            return n;
        });
    }

    _getValue(key: string): Promise<string> {
        return firebase
            .config()
            .getValue(key)
            .then(snapshot => {
                return snapshot.val();
            });
    }
}

export const configBackendFacade = new ConfigBackendFacade();
