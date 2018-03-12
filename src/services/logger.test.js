// @flow

jest.unmock('./logger');
import { Logger } from './logger';

it("logs to local logger if there isn't an error", () => {
    const { log, localMock } = createLog();

    log.info('foo');

    expect(localMock.log).toHaveBeenCalledWith('foo');
});

it("logs to remote logger if there isn't an error", () => {
    const { log, remoteMock } = createLog();

    log.info('foo');

    expect(remoteMock.log).toHaveBeenCalledWith('foo');
});

it("logs to local logger if there's an error", () => {
    const { log, localMock } = createLog();

    log.info('foo %j', new Error());

    expect(localMock.log).toHaveBeenCalled();
});

it("doesn't report to remote logger if there isn't an error", () => {
    const { log, remoteMock } = createLog();

    log.info('foo');

    expect(remoteMock.recordError).not.toHaveBeenCalled();
});

it("logs to remote logger if there's an error", () => {
    const { log, remoteMock } = createLog();

    const e = new Error();
    log.info('foo %j', e);

    expect(remoteMock.recordError).toHaveBeenCalledWith(e);
});

it('replaces variables in the format string', () => {
    const { log, localMock, remoteMock } = createLog();

    log.info('foo %s bar', 'to');

    expect(localMock.log).toHaveBeenCalledWith('foo to bar');
    expect(remoteMock.log).toHaveBeenCalledWith('foo to bar');
});

it('logs the error message locally and the error remotely', () => {
    const { log, localMock, remoteMock } = createLog();
    const e = new Error('bar');

    log.debug('foo %s', e);

    expect(localMock.log).toHaveBeenCalledWith('foo Error: bar');
    expect(remoteMock.recordError).toHaveBeenCalledWith(e);
});

it('logs events remotely only', () => {
    const { log, localMock, remoteMock } = createLog();

    log.event('foo');

    expect(localMock.log).not.toHaveBeenCalled();
    expect(remoteMock.logEvent).toHaveBeenCalledWith('foo');
});

function createLog() {
    const localMock = {
        log: jest.fn(),
        error: jest.fn(),
    };
    const remoteMock = {
        log: jest.fn(),
        recordError: jest.fn(),
        logEvent: jest.fn(),
    };
    const log = new Logger(localMock, remoteMock);

    return {
        localMock,
        remoteMock,
        log,
    };
}
