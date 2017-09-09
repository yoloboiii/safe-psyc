// @flow

import { startRandomSession } from './navigation-actions.js';

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
});
