// @flow

import { stringifyComponent } from './component-tree-utils.js';

expect.extend({
    toContainString: (component, string) => {
        return toContainStrings(component, string);
    },
    toContainStrings: toContainStrings,
});

function toContainStrings(component, ...strings) {
    const needles = [].concat.apply([], strings);
    const stringRep = stringifyComponent(component).toLowerCase();

    return {
        pass: needles.every(needle => stringRep.indexOf(needle) !== -1),
        message: 'expected\n  ' + stringRep + '\n\nto contain all of\n  [' + needles.join(', ') + ']',
    };
}

