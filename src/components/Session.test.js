// @flow

import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import { Session } from './Session.js';
import { QuestionComponent } from './Question.js';
import { getChildrenAndParent } from '../../tests/toHaveMatcher.js';
import { Button } from 'react-native';

import renderer from 'react-test-renderer';
import reactElementToJSXString from 'react-element-to-jsx-string';

it('shows an error screen if no questions are given', () => {
    const questions = [];
    const component = render({ questions: questions });

    expect(component).toContainStrings('no', 'question');
    expect(component).not.toHaveChild(QuestionComponent);
});

it('starts by showing a question', () => {
    const questions = randomQuestions();
    const component = render({ questions: questions });

    expect(component).toHaveChild(QuestionComponent);
});

it.only('shows another question when the first is answered', () => {
    const questions = randomQuestions();
    const component = render({ questions: questions });

    const firstQuestion = getQuestion(component);
    clickAnswer(component);
    const secondQuestion = getQuestion(component);

    console.log(firstQuestion);
    console.log(secondQuestion);
    expect(secondQuestion).not.toEqual(firstQuestion);
});

it('shows all questions eventually', () => {
    const questions = randomQuestions();
    const component = render({ questions: questions });

    expect(true).toBe(false);
});

it('doesn\'t repeat correctly answered questions', () => {
    const questions = randomQuestions();
    const component = render({ questions: questions });

    expect(true).toBe(false);
});

it('repeats an incorrectly answered question immediately', () => {
    const questions = randomQuestions();
    const component = render({ questions: questions });

    expect(true).toBe(false);
});

it('repeats a question answered incorrectly thrice in a row at the end of the session', () => {
    const questions = randomQuestions();
    const component = render({ questions: questions });

    expect(true).toBe(false);
});

function render(props) {
    /*const shallowRenderer = new ReactShallowRenderer();
    shallowRenderer.render(<Session {...props} />);
    return shallowRenderer.getRenderOutput();*/
    return renderer.create(<Session {...props} />);
}

function randomQuestions() {
    const qs = [];
    for (let i = 0; i < 10; i++) {
        qs.push(createRandomQuestion(i));
    }
    return qs;
}

function createRandomQuestion(c=0) {
    const uniqueString = 'THIS IS THE QUESTION TEXT '+c;
    return {
        type: 'word-question',
        questionText: uniqueString,
        answer: 'ans-' + uniqueString,
    };
}

function getQuestion(component) {
    const questions = getKidsAndParent(component)
    //const questions = getChildrenAndParent(component.toJSON())
        .map(c => c.props)
        .filter(p => p && p.question)

    return questions[0];
}

function getKidsAndParent(component) {
    const comps = [];

    const tree = component.toTree
        ? component.toTree()
        : component;
    visitComponentTree(tree, c => comps.push(c));

    return comps;
}

function visitComponentTree(root, visitor) {

    const unvisited = [root];
    while (unvisited.length > 0) {
        const component = unvisited.pop();
        if (!component) {
            console.log('Tried to visit undefined component');
            continue;
        }

        visitor(component);

        if (component.rendered) {
            if (Array.isArray(component.rendered)) {
                for (const child of component.rendered) {
                    unvisited.push(child);
                }
            } else {
                unvisited.push(component.rendered);
            }
        }
    }
}

function clickAnswer(component) {
    const qComponent = getKidsAndParent(component)
        .filter(c => {
            return c.type === QuestionComponent;
        })[0];

    const buttons = getKidsAndParent(qComponent)
        .filter(c => {
            return c.type === Button;
        });

    if (buttons.length === 0) {
        console.log('Found no buttons');
    }

    const correctAnswerButton = buttons[0];
    correctAnswerButton.props.onPress();
}
