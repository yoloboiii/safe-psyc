// @flow

import { firebase } from './firebase.js';

interface LocalLogger {
    log(any): void,
    error(any): void,
};
interface RemoteLogger {
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
        this._log(this.local.log, msg, args);
    }

    info(msg: string, ...args: Array<mixed>) {
        this._log(this.local.log, msg, args);
    }

    error(msg: string, ...args: Array<mixed>) {
        this._log(this.local.error, msg, args);
    }

    _log(f, msg: string, args: Array<mixed>) {
        f(msg, ...args);

        args.forEach(a => {
            if (a instanceof Error) {
                this.remote.report(a);
            }
        });

    }
}
export const log = new Logger(console, firebase);

