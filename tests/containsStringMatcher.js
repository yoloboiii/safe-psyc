// @flow

import { getAllRenderedStrings } from './component-tree-utils.js';

expect.extend({
    toContainString: (component, string) => {
        return toContainStrings(component, string);
    },
    toContainStrings: toContainStrings,
});

function toContainStrings(component, ...strings) {
    const needles = [].concat.apply([], strings);
    const renderedStrings = getAllRenderedStrings(component).map(s => s.toLowerCase()).join('');

    return {
        pass: needles.every(needle => renderedStrings.indexOf(needle.toLowerCase()) !== -1),
        message: () => 'expected\n  ' + renderedStrings + '\n\nto contain all of\n  [' + needles.join(', ') + ']',
    };
}

