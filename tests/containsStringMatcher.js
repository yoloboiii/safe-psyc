// @flow

import reactElementToJSXString from 'react-element-to-jsx-string';

expect.extend({
    toContainStrings: (component, ...strings) => {
        const needles = [].concat.apply([], strings);
        const stringRep = stringifyComponent(component).toLowerCase();

        return {
            pass: needles.every(needle => stringRep.indexOf(needle) !== -1),
            message: 'expected\n  ' + stringRep + '\n\nto contain all of\n  [' + needles.join(', ') + ']',
        };
    },
});

function stringifyComponent(component) {
    return reactElementToJSXString(component);
}
