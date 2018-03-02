// @flow

// Stolen from https://gist.github.com/robwise/1b36656e6ed7645ae33716dfb19fb60a
import moment from 'moment';
import diff from 'jest-diff';

// see: https://facebook.github.io/jest/docs/expect.html#expectextendmatchers
expect.extend({
  toEqualDate(unparsedReceived, unparsedExpected) {
    const received = moment(unparsedReceived);
    const expected = moment(unparsedExpected);

    const receivedAsString = received.format('LLLL');
    const expectedAsString = expected.format('LLLL');

    const pass = received.isSame(expected);

    const message = pass
      ? () =>
          `${this.utils.matcherHint('.not.toBe')}\n\n` +
          'Expected date to not be same date as:\n' +
          `  ${this.utils.printExpected(expectedAsString)}\n` +
          'Received:\n' +
          `  ${this.utils.printReceived(receivedAsString)}`
      : () => {
        const diffString = diff(expectedAsString, receivedAsString, {
          expand: this.expand,
        });
        return `${this.utils.matcherHint('.toBe')}\n\n` +
            'Expected value to be (using ===):\n' +
            `  ${this.utils.printExpected(expectedAsString)}\n` +
            'Received:\n' +
            `  ${this.utils.printReceived(receivedAsString)}${diffString ? `\n\nDifference:\n\n${diffString}` : ''}`;
      };
    return { actual: received, message, pass };
  },

    toBeCloserTo(shouldBeCloser, target, conf) {
        if (!conf || !conf.than) {
            return {
                pass: false,
                message: () => `${this.utils.RECEIVED_COLOR('You must give an object containing a key called "than" as the second argument.\n\n  e.g. expect(a).toBeCloserTo(x, { than: b })')}`,
            };
        }

        const other = conf.than;

        const shouldBeCloserDiff = moment.duration( shouldBeCloser.diff(target) );
        const otherDiff = moment.duration( other.diff(target) );
        const pass = Math.abs(shouldBeCloserDiff.asMilliseconds()) < Math.abs(otherDiff.asMilliseconds());

        const formattedShouldBeCloser = shouldBeCloser.format('LLLL');
        const formattedTarget = target.format('LLLL');
        const formattedOther = other.format('LLLL');

        const message = pass
            ? () =>
                matcherHint.call(this, '.not.toBeCloserTo') + `\n\n` + helpText.call(this, 'not ')
            : () =>
                matcherHint.call(this, '.toBeCloserTo') + `\n\n` + helpText.call(this);

        return {
            actual: shouldBeCloser,
            message,
            pass,
        };

        function matcherHint(matcherName) {
            return `${this.utils.matcherHint(matcherName, 'a', 'x', {
                secondArgument: '{ than: b }'
            })}`;
        }

        function helpText(not = '') {
            return `Expected\n\n` +
                `  ${this.utils.printExpected(formattedShouldBeCloser + ' (' + shouldBeCloserDiff.humanize()+ ')')}\n\n` +
                `to ${not}be closer to\n\n`+
                `  ${formattedTarget}\n\n`+
                `than the following is\n\n`+
                `  ${this.utils.printReceived(formattedOther + ' (' + otherDiff.humanize() + ')')}`;
        }
    },
});
