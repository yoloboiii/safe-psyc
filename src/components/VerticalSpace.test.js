// @flow

import React from 'react';
import renderer from 'react-test-renderer';

import { VerticalSpace } from './VerticalSpace.js';

it('defaults to multiplier 1', () => {
    const rendered = renderer.create(<VerticalSpace />);
    const height = rendered.toJSON().props.style.height;
    const multiplier = height / 10;

    expect(multiplier).toBe(1);
});

it.skip('returns the EXACT SAME style object', () => {
    // TODO: This test passes even if I always create new styles in the VerticalSpace component. I need help understanding this.

    const getStyle = component => renderer.create(component).toJSON().props.style;
    const firstStyle = getStyle(<VerticalSpace />);
    const secondStyle = getStyle(<VerticalSpace />);

    expect(firstStyle === secondStyle).toBe(true);
});
