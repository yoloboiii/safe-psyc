// @flow

import { firebase } from './firebase.js';
import { vsprintf } from 'sprintf-js';

interface LocalLogger {
    log(any): void;
    error(any): void;
}
interface RemoteLogger {
    log(string): void;
    recordError(Error): void;
    logEvent(string): void,
}
export class Logger {
    local: LocalLogger;
    remote: RemoteLogger;

    constructor(local: LocalLogger, remote: RemoteLogger) {
        this.local = local;
        this.remote = remote;
    }

    debug(msg: string, ...args: Array<mixed>) {
        this._log(this.local.log, msg, args);
    }

    info(msg: string, ...args: Array<mixed>) {
        this._log(this.local.log, msg, args);
    }

    warn(msg: string, ...args: Array<mixed>) {
        this.warning(msg, ...args);
    }

    warning(msg: string, ...args: Array<mixed>) {
        this._log(this.local.log, '[WARNING] ' + msg, args);
    }

    error(msg: string, ...args: Array<mixed>) {
        this._log(this.local.error, msg, args);
    }

    _log(localF, formatString: string, args: Array<mixed>) {
        const msg = vsprintf(formatString, args);
        localF(msg);
        this.remote.log(msg);

        args.forEach(a => {
            if (a instanceof Error) {
                this.remote.recordError(a);
            }
        });
    }

    event(eventName: string) {
        this.remote.logEvent(eventName);
    }
}

class FirebaseLogger {

    crashlytics: Object;
    analytics: Object;

    constructor() {
        this.crashlytics = firebase.crashlytics();
        this.analytics = firebase.analytics();

        this.analytics.setAnalyticsCollectionEnabled(true);
    }

    log(message: string) {
        this.crashlytics.log(message);
    }

    recordError(error: Error) {
        this.crashlytics.recordError(1, error.message);
    }

    logEvent(eventName) {
        //console.log('keuk', this.analytics);
        this.analytics.logEvent(eventName);
    }
}

export const log = new Logger(console, new FirebaseLogger());
