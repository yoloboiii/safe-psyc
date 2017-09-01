// @flow

expect.extend({
    toContainElementsOtherThan: function(elements, otherThan) {
        return {
            pass: elements.filter(element => !this.equals(element, otherThan)).length > 0,
            message: '[' + elements.join(', ') + '] didn\'t contain any elements other than ' + otherThan,
        };
    },
});
