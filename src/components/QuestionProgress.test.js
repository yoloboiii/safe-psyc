// @flow

import { QuestionProgress } from './QuestionProgress.js';
import { render } from '../../tests/render-utils.js';
import { getAllRenderedStrings } from '../../tests/component-tree-utils.js';

it('shows the current and total numbers', () => {
    const component = render(QuestionProgress, { current: 3, total: 5 });
    const texts = getAllRenderedStrings(component);

    let currentFound = false;
    let totalFound = false;
    texts.forEach(t => {
        if (t.indexOf('3') > -1) {
            currentFound = true;
        }

        if (t.indexOf('5') > -1) {
            totalFound = true;
        }
    });

    expect(currentFound).toBe(true);
    expect(totalFound).toBe(true);
});
