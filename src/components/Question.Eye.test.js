// @flow

import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import { EyeQuestionComponent } from './Question.Eye.js';

it('contains the image', () => {
    const question = {
        type: 'eye-question',
        image: 'test-image.png',
        answer: 'THE ANSWER',
    };
    const component = render();

    console.log(component);
    expect(true).toBeFalse();
});

function render(props) {
    const shallowRenderer = new ReactShallowRenderer();
    shallowRenderer.render(<EyeQuestionComponent {...props} />);
    console.log(shallowRenderer);
    return shallowRenderer.getRenderOutput();
}
