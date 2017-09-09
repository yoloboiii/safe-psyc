// @flow

import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import renderer from 'react-test-renderer';
import reactElementToJSXString from 'react-element-to-jsx-string';
import util from 'util';

import { Button } from 'react-native';
import { QuestionComponent } from '../src/components/Question.js';

import type { Question } from '../src/models/questions.js';

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

export function randomQuestions(numberOfQuestions:number = 10): Array<Question> {
    const qs = [];
    for (let i = 0; i < numberOfQuestions; i++) {
        qs.push(randomQuestion(i));
    }
    return qs;
}

export function randomQuestion(c: number=0): Question {
    const uniqueString = 'THIS IS THE QUESTION TEXT '+c;
    return {
        type: 'word-question',
        questionText: uniqueString,
        answer: 'ans-' + uniqueString,
    };
}

export function getQuestion(component: React.Component<*,*>) {
    const questions = getChildrenAndParent(component)
        .filter(c => c.type && c.type.name === 'QuestionComponent')
        .map(c => c.props)
        .filter(p => p && p.question)
        .map(p => p.question);

    return questions[0];
}

export function getChildrenAndParent(parent: React.Component<*,*>) {
    const isShallow = isShallowRendered(parent);
    if(isShallow) {
        return getChildrenAndParent_ShallowRenderer(parent);
    } else {
        return getChildrenAndParent_TestRenderer(parent);
    }
}

function isShallowRendered(component) {
    // $FlowFixMe
    return component['$$typeof'] !== undefined;
}

function getChildrenAndParent_TestRenderer(parent) {
    const comps = [];

    const tree = parent.toTree
        // $FlowFixMe
        ? parent.toTree()
        : parent;
    visitComponentTree(tree, c => comps.push(c));

    return comps;
}

function getChildrenAndParent_ShallowRenderer(parent) {
    return [parent].concat(getChildren(parent));
}

function getChildren(component: React.Component<*,*>) {
    if (!component || !component.props || !component.props.children) {
        return [];
    }

    let children = component.props.children;
    if (!Array.isArray(children)) {
        children = [children];
    }

    const grandchildren = children.map(c => getChildren(c));
    const flattenedGrandChildren = [].concat.apply([], grandchildren);
    return children.concat(flattenedGrandChildren);
}

export function visitComponentTree(root: React.Component<*,*>, visitor: (React.Component<*,*>)=>mixed){

    const unvisited: Array<React.Component<*,*>> = [root];
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
                    // $FlowFixMe
                    unvisited.push(child);
                }
            } else {
                // $FlowFixMe
                unvisited.push(component.rendered);
            }
        }
    }
}

export function clickAnswer(component: React.Component<*,*>) {
    const buttons = findAnswerButtons(component);
    const correctAnswerButton = buttons
        .filter(b => {
            return b.props.title.indexOf('ans') > -1;
        })[0];

    correctAnswerButton.props.onPress();
}

export function findAnswerButtons(component: React.Component<*,*>) {
    const qComponent = getChildrenAndParent(component)
        .filter(c => {
            // $FlowFixMe
            return c.type === QuestionComponent;
        })[0];

    const buttons = getChildrenAndParent(qComponent)
        .filter(c => {
            // $FlowFixMe
            return c.type === Button;
        });

    if (buttons.length === 0) {
        console.log('Found no buttons');
    }

    return buttons;
}

export function clickWrongAnswer(component: React.Component<*,*>) {
    const buttons = findAnswerButtons(component);
    const wrongAnswerButton = buttons
        .filter(b => {
           return b.props.title.indexOf('ans') === -1;
        })[0];


    wrongAnswerButton.props.onPress();
}

export function findChildren(root: React.Component<*, *>, childType: Function) {
    return getChildrenAndParent(root)
        .filter(c => {
            // $FlowFixMe
            const correctType = c && c.type === childType;
            return correctType;
        });
}

export function stringifyComponent(component: React.Component<*,*>): string {
    if (isShallowRendered(component)) {
        return reactElementToJSXString(component);
    } else {
        return util.inspect(component, { depth: 5 });
    }
}
