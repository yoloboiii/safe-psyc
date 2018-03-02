// @flow

import { QuestionProgress } from './QuestionProgress.js';
import { render } from '../../tests/render-utils.js';
import { findChildren } from '../../tests/component-tree-utils.js';
import * as Progress from 'react-native-progress';

it('shows 0% progress on the first question', () => {
    const component = render(QuestionProgress, { current: 1, total: 10 });

    const progress = getProgress(component);
    expect(progress).toBe(0);
});

it('shows 10% progress on the second question of 10', () => {
    const component = render(QuestionProgress, { current: 2, total: 10 });

    const progress = getProgress(component);
    expect(progress).toBe(0.1);
});

it('shows 90% progress before the last question is answered', () => {
    const component = render(QuestionProgress, { current: 10, total: 10 });

    const progress = getProgress(component);
    expect(progress).toBe(0.9);
});

it('shows 100% progress after the last question is answered', () => {
    const component = render(QuestionProgress, { current: 11, total: 10 });

    const progress = getProgress(component);
    expect(progress).toBe(1);
});

function getProgress(component): number {
    const progressBars = findChildren(component, Progress.Bar);
    if (progressBars.length != 1) {
        throw new Error('Expected exactly one progress bar, found ' + progressBars.length);
    }

    const progressBar = progressBars[0];
    return progressBar.props.progress;
}
