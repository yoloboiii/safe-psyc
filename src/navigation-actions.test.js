// @flow

import * as navActions from './navigation-actions.js';
import moment from 'moment';
import { mockNavigation } from '../tests/navigation-utils.js';

import type { CurrentEmotionBackendFacade } from './services/current-emotion-backend.js';

describe('startRandomSession', () => {
    it('navigates to "Session"', () => {
        const navigation = mockNavigation();
        const { navigate } = navigation;

        return navActions
            .startRandomSession()
            .then(() => {
                expect(navigate).toHaveBeenCalledTimes(1);
                expect(navigate).toHaveBeenCalledWith('Session', expect.anything());
            });
    });

    it('contains 10 questions', () => {
        const navigation = mockNavigation();
        const { navigate } = navigation;

        return navActions
            .startRandomSession()
            .then(() => {
                const args = navigate.mock.calls[0][1];
                if (!args || !args.questions) {
                    throw 'was not called with 10 questions';
                } else {
                    expect(args.questions.length).toBe(10);
                }
            });
    });
});

describe('routeToCurrentFeelingOrHome', () => {
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
        }: any): CurrentEmotionBackendFacade);

        const navigation = mockNavigation();
        const { dispatch } = navigation;

        return navActions
            .routeToCurrentFeelingOrHome(backendFacade)
            .then(() => {
                expect(dispatch).toHaveBeenCalledTimes(1);

                const action = dispatch.mock.calls[0][0];

                expect(action.index).toEqual(1);
                expect(action.actions.map(a => a.routeName)).toEqual(['Home', 'CurrentFeeling']);
            })
            .then(() => {
                dispatch.mockReset();
                return navActions.routeToCurrentFeelingOrHome(backendFacade);
            })
            .then(() => {
                expect(dispatch).toHaveBeenCalledTimes(1);
                expect(dispatch.mock.calls[0][0].actions.map(a => a.routeName)).not.toContain(
                    'CurrentFeeling'
                );
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
        }: any): CurrentEmotionBackendFacade);

        const navigation = mockNavigation();
        const { dispatch } = navigation;

        return navActions.routeToCurrentFeelingOrHome(backendFacade).then(() => {
            expect(dispatch).toHaveBeenCalled();
            const params = dispatch.mock.calls[0][0].actions
                .filter(a => a.routeName === 'CurrentFeeling')
                .map(a => a.params)[0];

            expect(params).toEqual(expect.objectContaining({ skippable: true }));
        });
    });
});

describe('onUserLoggedOut', () => {
    it('resets to pitch if file system marker not set', () => {
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
        const navigation = mockNavigation();
        const { dispatch } = navigation;

        return navActions.onUserLoggedOut(storage).then(() => {
            expect(dispatch).toHaveBeenCalledTimes(1);

            const arg = dispatch.mock.calls[0][0];
            expect(arg.index).toBe(0);
            expect(arg.actions).toEqual([{ routeName: conf.expectedRoute }]);
        });
    }
});
