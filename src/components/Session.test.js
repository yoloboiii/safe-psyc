// @flow

import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import { Session } from './Session.js';
import { QuestionComponent } from './Question.js';
import { Button } from 'react-native';
import { answerService } from '../services/answer-service.js';

import renderer from 'react-test-renderer';


answerService.setAnswerPool(['a', 'b', 'c']);


it('shows an error screen if no questions are given', () => {
    const questions = [];
    const component = renderShallow({ questions: questions });

    expect(component).toContainStrings('no', 'question');
    expect(component).not.toHaveChild(QuestionComponent);
});

it('starts by showing a question', () => {
    const questions = randomQuestions();
    const component = renderShallow({ questions: questions });

    expect(component).toHaveChild(QuestionComponent);
});

it('shows another question when the first is answered', () => {
    const questions = randomQuestions();
    const component = render({ questions: questions });

    const firstQuestion = getQuestion(component);
    clickAnswer(component);
    const secondQuestion = getQuestion(component);

    expect(secondQuestion).not.toEqual(firstQuestion);
});

it('finishes the session if the last question was answered correctly', () => {
    const questions = randomQuestions(1);
    const sessionFinishedSpy = jest.fn();

    const component = render({
        questions: questions,
        onSessionFinished: sessionFinishedSpy,
    });

    clickAnswer(component);

    expect(sessionFinishedSpy.mock.calls.length).toBe(1);
});

it('shows all questions eventually', () => {
    const questions = randomQuestions();
    const component = render({ questions: questions });

    const seen = new Map();
    for (let i = 0; i < questions.length; i++) {
        const question = getQuestion(component);
        seen.set(question, true);
        clickAnswer(component);
    }

    expect(seen.size).toBe(questions.length);
});

it('doesn\'t repeat correctly answered questions', () => {
    const questions = randomQuestions();
    const component = render({ questions: questions });

    const seen = new Map();
    for (let i = 0; i < questions.length; i++) {
        const question = getQuestion(component);
        expect(seen.has(question)).toBe(false);

        seen.set(question, true);

        clickAnswer(component);
    }
});

it('repeats an incorrectly answered question immediately', () => {
    const questions = randomQuestions();
    const component = render({ questions: questions });

    const firstQuestion = getQuestion(component);
    clickWrongAnswer(component);
    const secondQuestion = getQuestion(component);

    expect(secondQuestion).toEqual(firstQuestion);
});

it('repeats a question answered incorrectly thrice in a row at the end of the session', () => {
    const questions = randomQuestions();
    const component = render({ questions: questions });

    // Answer the first question correctly, for some reason :)
    clickAnswer(component);

    // Answer the second question wrong three times in a row
    const theDifficultQuestion = getQuestion(component);
    clickWrongAnswer(component);
    clickWrongAnswer(component);
    clickWrongAnswer(component);

    // Answer the rest of the questions correctly
    for (let i = 2; i < questions.length; i++) {
        clickAnswer(component);
    }

    const lastQuestion = getQuestion(component);
    expect(lastQuestion).toBe(theDifficultQuestion);
});

function renderShallow(customProps) {
    const defaultProps = {
        onSessionFinished: () => {},
    };
    const props = Object.assign({}, defaultProps, customProps);

    const shallowRenderer = new ReactShallowRenderer();
    shallowRenderer.render(<Session {...props} />);
    return shallowRenderer.getRenderOutput();
}

function render(customProps) {
    const defaultProps = {
        onSessionFinished: () => {},
    };
    const props = Object.assign({}, defaultProps, customProps);

    return renderer.create(<Session {...props} />);
}

function randomQuestions(numberOfQuestions=10) {
    const qs = [];
    for (let i = 0; i < numberOfQuestions; i++) {
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
        .filter(c => c.type && c.type.name === 'QuestionComponent')
        .map(c => c.props)
        .filter(p => p && p.question)
        .map(p => p.question);

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
    const buttons = findAnswerButtons(component);
    const correctAnswerButton = buttons
        .filter(b => {
            return b.props.title.indexOf('ans') > -1;
        })[0];

    correctAnswerButton.props.onPress();
}

function findAnswerButtons(component) {
    const qComponent = getKidsAndParent(component)
        .filter(c => {
            return c.type === QuestionComponent;
        })[0];

    const buttons = getKidsAndParent(qComponent)
        .filter(c => {
            //console.log(c);
            return c.type === Button;
        });

    if (buttons.length === 0) {
        console.log('Found no buttons');
    }

    return buttons;
}

function clickWrongAnswer(component) {
    const buttons = findAnswerButtons(component);
    const wrongAnswerButton = buttons
        .filter(b => {
           return b.props.title.indexOf('ans') === -1;
        })[0];


    wrongAnswerButton.props.onPress();
}
