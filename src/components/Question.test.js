// @flow

import React from 'react';
import renderer from 'react-test-renderer';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import reactElementToJSXString from 'react-element-to-jsx-string';

import { QuestionComponent } from './Question.js';
import { EyeQuestionComponent } from './Question.Eye.js';
import { EmotionWordQuestionComponent } from './Question.Word.js';

expect.extend({
    toHaveChild: function (received, childConstructor) {
        let children = received.props.children;
        if (typeof children === 'object') {
            children = [children];
        }

        const matchingChildren = children.filter(c => {
            const correctType = c.type === childConstructor;
            return correctType;
        });

        const message = () => 'Could not find ' + childConstructor.name + ' in ' + reactElementToJSXString(received);

        return {
            pass: matchingChildren.length > 0,
            message: message,
        };
    },
    toHaveChildWithProps: function (received, childConstructor, childProps) {
        const equals = this.equals;

        let children = received.props.children;
        if (typeof children === 'object') {
            children = [children];
        }

        const matchingChildren = children.filter(c => {
            const correctType = c.type === childConstructor;
            if (correctType && childProps) {
                const correctProps = Object.keys(childProps).every(
                    key =>
                        c.props.hasOwnProperty(key) &&
                        equals(c.props[key], childProps[key])
                    );
                return correctType && correctProps;
            }
            return correctType;
        });


        let propsMessage = '';
        if (childProps) {
            propsMessage = ' with props ' + JSON.stringify(childProps, null, 2);
        }
        const message = () => 'Could not find ' + childConstructor.name + propsMessage + ' in ' + reactElementToJSXString(received);

        return {
            pass: matchingChildren.length > 0,
            message: message,
        };
    },
});



it('renders without crashing', () => {
    const anyQuestion = {};
    const rendered = renderer.create(<QuestionComponent question={anyQuestion}/>).toJSON();
    expect(rendered).toBeTruthy();
});

it('renders eye questions', () => {
    const question = {
        type: 'eye-question',
        image: 'test-image.png',
        answer: 'THE ANSWER',
    };

    const shallowRenderer = new ReactShallowRenderer();
    shallowRenderer.render(<QuestionComponent question={question} />);
    const component = shallowRenderer.getRenderOutput();

    expect(component).toHaveChildWithProps(EyeQuestionComponent, {question: question});
    expect(component).not.toHaveChild(EmotionWordQuestionComponent);
});

it('renders word questions', () => {
    const question = {
        type: 'word-question',
        questionText: 'THE TEXT',
        answer: 'THE ANSWER',
    };

    const shallowRenderer = new ReactShallowRenderer();
    shallowRenderer.render(<QuestionComponent question={question} />);
    const component = shallowRenderer.getRenderOutput();

    expect(component).toHaveChildWithProps(EmotionWordQuestionComponent, {question: question});
    expect(component).not.toHaveChild(EyeQuestionComponent);
});
