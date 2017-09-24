// @flow

import React from 'react';
import { Text, TextInput } from 'react-native';
import { render } from '../../tests/render-utils.js';
import { getAllRenderedStrings, findChildren } from '../../tests/component-tree-utils.js';
import { ExpandedSearchableList } from './ExpandedSearchableList.js';

const defaultProps = {
    data: arrayToFlatListData(['a', 'b']),
    renderRow: (s) => <Text>{s.item.item}</Text>,
};

it('renders its data', () => {
    const component = render(ExpandedSearchableList, {
        data: arrayToFlatListData(['a', 'b']),
    }, defaultProps);

    expect(getAllRenderedStrings(component)).toEqual(expect.arrayContaining(['a', 'b']));
});

it('has an input field', () => {
    const component = render(ExpandedSearchableList, {}, defaultProps);
    expect(component).toHaveChild(TextInput);
});

it('filters the list when data is entered', () => {
    const words = ['aa', 'ab', 'ba', 'bb'];
    const component = render(ExpandedSearchableList, {
        data: arrayToFlatListData(words),
    }, defaultProps);

    const textInput = findChildren(component, TextInput)[0];
    textInput.props.onChangeText('a');

    expect(getAllRenderedStrings(component).every( s => s.indexOf('a') > -1)).toBe(true);

    textInput.props.onChangeText('aa');
    expect(getAllRenderedStrings(component)).toEqual(['aa']);

    textInput.props.onChangeText('');
    expect(getAllRenderedStrings(component)).toEqual(expect.arrayContaining(words));
});

function arrayToFlatListData(arr) {
    return arr.map(word => {
        return {
            item: word,
            key: word,
        };
    });
}
