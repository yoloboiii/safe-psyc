// @flow

import React from 'react';
import renderer from 'react-test-renderer';

import { VerticalSpace } from '~/src/components/lib/VerticalSpace.js';

it('defaults to multiplier 1', () => {
    const rendered = renderer.create(<VerticalSpace />);
    const height = rendered.toJSON().props.style.height;
    const multiplier = height / 10;

    expect(multiplier).toBe(1);
});

it('returns the EXACT SAME style object', () => {
    const firstStyle = getStyle(<VerticalSpace />);
    const secondStyle = getStyle(<VerticalSpace />);

    expect(firstStyle).toBe(secondStyle);
});

function getStyle(component) {
    return renderer.create(component).toJSON().props.style;
}
