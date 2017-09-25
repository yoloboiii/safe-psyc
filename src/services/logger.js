// @flow

import { firebase } from './firebase.js';

export class Logger {

    constructor(local, remote) {
        this.local = local;
        this.remote = remote;
    }

    info(msg: string, ...args: Array<mixed>) {
        this.local.log(msg, ...args);

        args.filter(a => a instanceof Error)
            .forEach(error => {
                this.remote.report(error);
            });
    }
}
export const log = new Logger(console, firebase);

