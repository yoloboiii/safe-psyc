// @flow

import React from 'react';
import { View } from 'react-native';
import { Loader } from './Loader.js';
import { render } from '../../tests/render-utils.js';
import { findChildren } from '../../tests/component-tree-utils.js';
import { checkNextTick } from '../../tests/utils.js';

const defaultProps = {
    initial: <View id='initial' size={{ width: 1, height: 2 }} />,
    loading: <View id='loading' size={{ width: 3, height: 4 }} />,
    success: <View id='success' size={{ width: 5, height: 6 }}  />,
    failure: <View id='failure' size={{ width: 7, height: 8 }}  />,

    action: () => Promise.resolve(),
};

it('measures the components', () => {
    const component = render(Loader, {}, defaultProps);

    triggerMeasuringStep(component);

    expect(component.getInstance().sizes).toEqual(expect.objectContaining({
        initial: { width: 1, height: 2 },
        loading: { width: 3, height: 4 },
        success: { width: 5, height: 6 },
        failure: { width: 7, height: 8 },
    }));
});

it('renders the initial component first', () => {
    const component = render(Loader, {}, defaultProps);
    triggerMeasuringStep(component);

    expect(component).toHaveChildMatching(c => c.props.id === 'initial');
});

fit('renders the loading component when entering the loading state', () => {
    const component = render(Loader, { action: () => {} }, defaultProps);
    triggerMeasuringStep(component);

    expect(component).toHaveChildMatching(c => c.props.id === 'loading');
});

function triggerMeasuringStep(component) {
    findChildren(component, View)
        .filter(v => !!v.props.onLayout)
        .map(v => {
            const { children } = v.props;
            const { size } = children.props;
            v.instance.measure = jest.fn( cb => cb(
                0, 0,
                size.width, size.height
            ) );
            return v;
        })
        .map(v => v.props.onLayout());
}
