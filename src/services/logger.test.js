// @flow

import { Logger } from './logger';

function createLog() {
    const localMock = {
        log: jest.fn(),
    };
    const remoteMock = {
        report: jest.fn(),
    };
    const log = new Logger(localMock, remoteMock);

    return {
        localMock,
        remoteMock,
        log,
    };
}
it('logs to local logger if there isn\'t an error',  () => {
    const { log, localMock } = createLog();

    log.info('foo', 'bar');

    expect(localMock.log).toHaveBeenCalled();
});
it('logs to local logger if there\'s an error',  () => {
    const { log, localMock } = createLog();

    log.info('foo', new Error());

    expect(localMock.log).toHaveBeenCalled();
});

it('doesn\'t log to remote logger if there isn\'t an error',  () => {
    const { log, remoteMock } = createLog();

    log.info('foo', 'bar');

    expect(remoteMock.report).not.toHaveBeenCalled();
});

it('logs to remote logger if there\'s an error', () => {
    const { log, remoteMock } = createLog();

    log.info('foo', new Error());

    expect(remoteMock.report).toHaveBeenCalled();
});
