// @flow

import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import renderer from 'react-test-renderer';

export function render(Component: Function, customProps: Object, defaultProps: Object) {
    const props = Object.assign({}, defaultProps, customProps);

    return renderer.create(<Component {...props} />);
}

export function renderShallow(Component: Function, customProps: Object, defaultProps: Object) {
    const props = Object.assign({}, defaultProps, customProps);

    const shallowRenderer = new ReactShallowRenderer();
    shallowRenderer.render(<Component {...props} />);
    return shallowRenderer.getRenderOutput();
}

