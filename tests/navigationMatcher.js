// @flow

expect.extend({
    toHaveResetTo: (received, route) => {
        const { calls } = received.mock;
        const numCalls = calls.length;

        if (numCalls !== 1) {
            return {
                pass: false,
                message: () => 'expected mock to have been called one time, it was called ' + numCalls + ' times',
            };
        }

        const args = calls[0][0];
        if (args.index !== 0) {
            return {
                pass: false,
                message: () => 'expected index to be 0, it was ' + args.index,
            };
        }

        if (args.actions.length !== 1) {
            return {
                pass: false,
                message: () => 'expected actions to be an array with one item, it was [' + args.actions.map(a => JSON.stringify(a)).join(', ') + ']',
            };
        }

        if (args.actions[0].routeName !== route) {
            return {
                pass: false,
                message: () => 'expected to reset to ' + route + ', but was reset to ' + args.actions[0].routeName,
            };
        }

        return {
            pass: true,
        };
    },
});
