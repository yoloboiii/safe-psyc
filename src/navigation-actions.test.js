// @flow

import { InteractionManager } from 'react-native';
import { startRandomSession, onSessionFinished } from './navigation-actions.js';
import { sessionService } from './services/session-service.js';
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

    it('contains 10 questions', (done) => {
        const navigateMock = jest.fn();

        startRandomSession({ navigate: navigateMock, dispatch: jest.fn() });

        checkNextTick(done, () => {
            const args = navigateMock.mock.calls[0][1];
            if (!args || !args.questions) {
                throw 'was not called with 10 questions';
            } else {
                expect(args.questions.length).toBe(10);
            }
        });
    });

    it('contains an answer service with the answers to all questions in its pool', () => {
        const navigateMock = jest.fn();

        return startRandomSession({ navigate: navigateMock, dispatch: jest.fn() })
            .then( () => {

                const args = navigateMock.mock.calls[0][1];
                if (!args || !args.questions || !args.answerService) {
                    throw 'was not called with questions or an AnswerService';
                } else {
                    const pool = args.answerService._answerPool;

                    expect(pool.length).toBe(sessionService.getQuestionPool().length);
                    expect(
                        args.questions.every( question => pool.indexOf(question.emotion) > -1 )
                    ).toBe(true);
                }
            });
    });
});

describe('onSessionFinished', () => {
    // TODO: react-navigation is behaving weirdly after the eject. I keep getting
    // import type { NavigationAction } from './TypeDefinition';
    // ^^^^^^
    //
    // SyntaxError: Unexpected token import
    // at ScriptTransformer._transformAndBuildScript (/home/erik/Code/safe-psyc/node_modules/jest-runtime/build/script_transformer.js:306:17)
    // at ScriptTransformer.transform (/home/erik/Code/safe-psyc/node_modules/jest-runtime/build/script_transformer.js:333:21)
    // at Runtime._execModule (/home/erik/Code/safe-psyc/node_modules/jest-runtime/build/index.js:502:53)
    // at Runtime.requireModule (/home/erik/Code/safe-psyc/node_modules/jest-runtime/build/index.js:333:14)
    // at Runtime.requireModuleOrMock (/home/erik/Code/safe-psyc/node_modules/jest-runtime/build/index.js:409:19)
    // at Object.get NavigationActions [as NavigationActions] (/home/erik/Code/safe-psyc/node_modules/react-navigation/src/react-navigation.js:19:12)
    // at /home/erik/Code/safe-psyc/src/navigation-actions.js:113:1723
    // at tryCallOne (/home/erik/Code/safe-psyc/node_modules/promise/lib/core.js:37:12)
    // at /home/erik/Code/safe-psyc/node_modules/promise/lib/core.js:123:15
    // at flush (/home/erik/Code/safe-psyc/node_modules/asap/raw.js:50:29)

    it.skip('should redirect to howrufeelin once per day', () => {

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
