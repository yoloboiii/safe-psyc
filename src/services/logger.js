// @flow

import { firebase } from './firebase.js';
import { vsprintf } from 'sprintf-js';

interface LocalLogger {
    log(any): void,
    error(any): void,
};
interface RemoteLogger {
    log(any): void,
    report(Error): void,
};
export class Logger {

    local: LocalLogger;
    remote: RemoteLogger;

    constructor(local: LocalLogger, remote: RemoteLogger) {
        this.local = local;
        this.remote = remote;
    }

    debug(msg: string, ...args: Array<mixed>) {
        this._log(
            this.local.log,
            this.remote.log,
            msg,
            args);
    }

    info(msg: string, ...args: Array<mixed>) {
        this._log(
            this.local.log,
            this.remote.log,
            msg,
            args);
    }

    error(msg: string, ...args: Array<mixed>) {
        this._log(
            this.local.error,
            this.remote.log,
            msg,
            args);
    }

    _log(localF, remoteF, formatString: string, args: Array<mixed>) {
        const msg = vsprintf(formatString, args);
        localF(msg);
        remoteF(msg);

        args.forEach(a => {
            if (a instanceof Error) {
                this.remote.report(a);
            }
        });

    }
}
export const log = new Logger(console, firebase.crash());

