// @flow

import { firebase } from './firebase.js';
import { vsprintf } from 'sprintf-js';

interface LocalLogger {
    log(any): void;
    error(any): void;
}
interface RemoteLogger {
    log(string): void;
    recordError(number, Error): void;
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
                this.remote.recordError(1, a);
            }
        });
    }
}

export const log = new Logger(console, firebase.fabric.crashlytics());
