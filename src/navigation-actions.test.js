// @flow

import { InteractionManager } from 'react-native';
import { startRandomSession, onSessionFinished } from './navigation-actions.js';
import moment from 'moment';

import type { BackendFacade } from './services/backend.js';

describe('startRandomSession', () => {

    it('navigates to "Session"', (done) => {
        const navigateMock = jest.fn();

        startRandomSession({ navigate: navigateMock, dispatch: jest.fn() });

        checkNextTick(done, () => {
            expect(navigateMock).toHaveBeenCalledTimes(1);
            expect(navigateMock).toHaveBeenCalledWith('Session', expect.anything());
        });
    });

    it('contains 20 questions', (done) => {
        const navigateMock = jest.fn();

        startRandomSession({ navigate: navigateMock, dispatch: jest.fn() });

        checkNextTick(done, () => {
            const args = navigateMock.mock.calls[0][1];
            if (!args || !args.questions) {
                throw 'was not called with 20 questions';
            } else {
                expect(args.questions.length).toBe(20);
            }
        });
    });

    it('contains an answer service with the answers to all questions in its pool', (done) => {
        const navigateMock = jest.fn();

        checkNextTick(done, () => {
            startRandomSession({ navigate: navigateMock, dispatch: jest.fn() });
            const args = navigateMock.mock.calls[0][1];
            if (!args || !args.questions || !args.answerService) {
                throw 'was not called with questions or an AnswerService';
            } else {
                const pool = args.answerService._answerPool;

                expect(pool.length).toBe(20);
                expect(
                    args.questions.every( question => pool.indexOf(question.answer) > -1 )
                ).toBe(true);
            }
        });
    });
});

describe('onSessionFinished', () => {
    it('should redirect to howrufeelin once per day', () => {

        // $FlowFixMe
        Date.now = jest.fn(() => new Date(Date.UTC(2017, 0, 1)).valueOf());

        const backendFacade = (({
            getLastFeelingAnswer: jest.fn()
                .mockReturnValueOnce(new Promise(r => {
                    r({
                        when: moment().subtract(10, 'hours'),
                    });
                }))
                .mockReturnValueOnce(new Promise(r => {
                    r({
                        when: moment(),
                    });
                })),
        }: any): BackendFacade);

        const dispatchMock = jest.fn();
        const navigation = { navigate: jest.fn(), dispatch: dispatchMock };

        return onSessionFinished(navigation, backendFacade)
            .then( () => {
                expect(dispatchMock).toHaveBeenCalledTimes(1);

                const action = dispatchMock.mock.calls[0][0];
                expect(action.type).toContain('RESET');

                expect(action.actions.map(a => a.routeName)).toEqual(['Home', 'CurrentFeeling']);
            })
            .then( () => {
                dispatchMock.mockReset();
                return onSessionFinished(navigation, backendFacade);
            })
            .then( () => {
                expect(dispatchMock).toHaveBeenCalledTimes(1);
                expect(
                    dispatchMock.mock.calls[0][0].actions.map(a => a.routeName)
                ).not.toContain('CurrentFeeling');
            });
    });
});

function checkNextTick(done, check) {
    InteractionManager.runAfterInteractions( () => {
        try {
            check();
            done();
        } catch (e) {
            // $FlowFixMe
            done(e);
        }
    });
}
