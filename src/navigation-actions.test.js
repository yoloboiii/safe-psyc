// @flow

import { InteractionManager } from 'react-native';
import * as navActions from './navigation-actions.js';
import moment from 'moment';

import type { BackendFacade } from './services/backend.js';

describe('startRandomSession', () => {
    it('navigates to "Session"', done => {
        const navigateMock = jest.fn();

        navActions.startRandomSession({
            navigate: navigateMock,
            dispatch: jest.fn(),
        });

        checkNextTick(done, () => {
            expect(navigateMock).toHaveBeenCalledTimes(1);
            expect(navigateMock).toHaveBeenCalledWith(
                'Session',
                expect.anything()
            );
        });
    });

    it('contains 10 questions', done => {
        const navigateMock = jest.fn();

        navActions.startRandomSession({
            navigate: navigateMock,
            dispatch: jest.fn(),
        });

        checkNextTick(done, () => {
            const args = navigateMock.mock.calls[0][1];
            if (!args || !args.questions) {
                throw 'was not called with 10 questions';
            } else {
                expect(args.questions.length).toBe(10);
            }
        });
    });
});

describe.skip('routeToCurrentFeelingOrHome', () => {
    it('should redirect to howrufeelin once per day', () => {
        // $FlowFixMe
        Date.now = jest.fn(() => new Date(Date.UTC(2017, 0, 1)).valueOf());

        const backendFacade = (({
            getLastEmotionAnswer: jest
                .fn()
                .mockReturnValueOnce(
                    new Promise(r => {
                        r({
                            when: moment().subtract(10, 'hours'),
                        });
                    })
                )
                .mockReturnValueOnce(
                    new Promise(r => {
                        r({
                            when: moment(),
                        });
                    })
                ),
        }: any): BackendFacade);

        const dispatchMock = jest.fn();
        const navigation = { navigate: jest.fn(), dispatch: dispatchMock };

        return navActions
            .routeToCurrentFeelingOrHome(navigation, backendFacade)
            .then(() => {
                expect(dispatchMock).toHaveBeenCalledTimes(1);

                const action = dispatchMock.mock.calls[0][0];
                expect(action.type).toContain('RESET');

                expect(action.actions.map(a => a.routeName)).toEqual([
                    'Home',
                    'CurrentFeeling',
                ]);
            })
            .then(() => {
                dispatchMock.mockReset();
                return navActions.routeToCurrentFeelingOrHome(
                    navigation,
                    backendFacade
                );
            })
            .then(() => {
                expect(dispatchMock).toHaveBeenCalledTimes(1);
                expect(
                    dispatchMock.mock.calls[0][0].actions.map(a => a.routeName)
                ).not.toContain('CurrentFeeling');
            });
    });

    it('should navigate the howrufeeling with the skippable param', () => {
        const backendFacade = (({
            getLastEmotionAnswer: jest.fn().mockReturnValueOnce(
                new Promise(r => {
                    r({
                        when: moment().subtract(10, 'hours'),
                    });
                })
            ),
        }: any): BackendFacade);

        const dispatchMock = jest.fn();
        const navigation = { navigate: jest.fn(), dispatch: dispatchMock };

        return navActions
            .routeToCurrentFeelingOrHome(navigation, backendFacade)
            .then(() => {
                expect(dispatchMock).toHaveBeenCalled();
                const params = dispatchMock.mock.calls[0][0].actions
                    .filter(a => a.routeName === 'CurrentFeeling')
                    .map(a => a.params)[0];

                expect(params).toEqual(
                    expect.objectContaining({ skippable: true })
                );
            });
    });
});

describe('onUserLoggedOut', () => {
    it.skip('resets to pitch if file system marker not set', () => {
        return doNav({
            expectedRoute: 'Pitch',
            hasSeenThePitch: Promise.resolve('false'),
        });
    });

    it("resets to pitch if there's an error reading the file system", () => {
        return doNav({
            expectedRoute: 'Pitch',
            hasSeenThePitch: Promise.reject(new Error('foo')),
        });
    });

    it('resets to login if file system marker is set', () => {
        return doNav({
            expectedRoute: 'Login',
            hasSeenThePitch: Promise.resolve('true'),
        });
    });

    type Conf = {
        expectedRoute: string,
        hasSeenThePitch: Promise<string>,
    };

    function doNav(conf: Conf) {
        const storage = {
            getItem: () => conf.hasSeenThePitch,
        };
        const dispatchMock = jest.fn();
        const navigation = { navigate: jest.fn(), dispatch: dispatchMock };

        return navActions.onUserLoggedOut(navigation, storage).then(() => {
            expect(dispatchMock).toHaveBeenCalledTimes(1);

            const arg = dispatchMock.mock.calls[0][0];
            expect(arg.index).toBe(0);
            expect(arg.actions).toEqual([{ routeName: conf.expectedRoute }]);
        });
    }
});

function checkNextTick(done, check) {
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
