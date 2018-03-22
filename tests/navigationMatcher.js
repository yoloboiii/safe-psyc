// @flow

expect.extend({
    toNeverHaveNavigated(received) {
        const a = call => call[0].routeName + ' - ' + this.utils.stringify(call[0].params);
        return {
            pass: received.calls === undefined,
            message: () => `${this.utils.matcherHint('.not.toBe')}\n\n` +

              'Expected to never have navigated but navigated to:\n' +
              `  ${this.utils.printReceived(received.mock.calls.map(a).join('\n'))}\n`
        };
    },
    toHaveNavigatedTo(received, route, params) {
        const { calls } = received.dispatch.mock;
        const numCalls = calls.length;

        for (const call of calls) {
            const { routeName: actualRouteName, params: actualParams } = call[0];

            const paramsCorrect = params
                ? this.utils.stringify(params) === this.utils.stringify(actualParams)
                : true;

            if (actualRouteName === route && paramsCorrect) {
                return {
                    pass: true,
                };
            }
        }

        const a = call => call[0].routeName + ' - ' + this.utils.stringify(call[0].params);
        return {
            pass: false,
            message: () => `${this.utils.matcherHint('.not.toBe')}\n\n` +

              'Expected navigation frame:\n' +
              `  ${this.utils.printExpected(route + ' - ' + this.utils.stringify(params))}\n` +
              'Received:\n' +
              `  ${this.utils.printReceived(calls.map(a).join('\n'))}\n`
        }
    },

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
