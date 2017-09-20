// @flow

import { render } from '../../tests/render-utils.js';
import { findChildren } from '../../tests/component-tree-utils.js';
import { CurrentFeeling } from './CurrentFeeling.js';
import { ExpandedSearchableList } from './ExpandedSearchableList.js';

it('has a list of emotion words', () => {
    const expectedWords = ['a', 'b', 'c'];
    const component = render(CurrentFeeling, {
        emotionWords: expectedWords,
    });

    const wordList = findChildren(component, ExpandedSearchableList)[0];
    const renderedWords = wordList.props.data.map(d => d.item);

    expect(renderedWords).toEqual(expectedWords);
});
