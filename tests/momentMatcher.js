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
});
