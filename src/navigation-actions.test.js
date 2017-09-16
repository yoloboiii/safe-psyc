// @flow

import { startRandomSession, onSessionFinished } from './navigation-actions.js';

describe('startRandomSession', () => {

    it('navigates to "Session"', () => {
        const navigateMock = jest.fn();

        startRandomSession({ navigate: navigateMock });

        expect(navigateMock).toHaveBeenCalledTimes(1);
        expect(navigateMock).toHaveBeenCalledWith('Session', expect.anything());
    });

    it('contains 20 questions', () => {
        const navigateMock = jest.fn();

        startRandomSession({ navigate: navigateMock });

        const args = navigateMock.mock.calls[0][1];
        if (!args || !args.questions) {
            throw 'was not called with 20 questions';
        } else {
            expect(args.questions.length).toBe(20);
        }
    });

    it('contains an answer service with the answers to all questions in its pool', () => {
        const navigateMock = jest.fn();

        startRandomSession({ navigate: navigateMock });
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

describe('onSessionFinished', () => {
    it('should redirect to howrufeelin once per day', () => {
        const navigateMock = jest.fn();
        const navigation = { navigate: navigateMock };

        onSessionFinished(navigation);

        expect(navigateMock).toHaveBeenCalledTimes(1);
        expect(navigateMock).toHaveBeenCalledWith('CurrentFeeling');

        navigateMock.mockReset();
        onSessionFinished(navigation);
        expect(navigateMock).toHaveBeenCalledTimes(1);
        expect(navigateMock).not.toHaveBeenCalledWith('CurrentFeeling');
    });
});
