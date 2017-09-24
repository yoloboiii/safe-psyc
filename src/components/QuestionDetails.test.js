// @flow

import { QuestionDetails, StrengthMeter } from './QuestionDetails.js';
import { render } from '../../tests/render-utils.js';
import { randomQuestion, randomEyeQuestion } from '../../tests/question-utils.js';
import { getAllRenderedStrings } from '../../tests/component-tree-utils.js';
import { Image } from 'react-native';
import moment from 'moment';

const defaultProps = {
    question: randomQuestion(),
    dataPoints: {
        correct: [],
        incorrect: [],
    },
};

it('contains the image and answer of an eye question', () => {
    const question = randomEyeQuestion();
    const component = render(QuestionDetails, { question }, defaultProps);

    expect(component).toHaveChildWithProps(Image, { source: {uri: question.image }});
    expect(getAllRenderedStrings(component)).toEqual(expect.arrayContaining([question.answer]));
});

it('contains a strength meter', () => {
    const component = render(QuestionDetails, {
        dataPoints: {
            correct: [moment(), moment(), moment(), moment()],
            incorrect: [],
        },
    }, defaultProps);

    expect(component).toHaveChild(StrengthMeter);
});

it('is humble about the strength meter when there\'s not enough data', () => {
    const component = render(QuestionDetails, {
        dataPoints: {
            correct: [],
            incorrect: [],
        },
    }, defaultProps);

    expect(component).not.toHaveChild(StrengthMeter);
});

it('shows emotions that the user often confuse with the main emotion', () => {
    const questionA = randomQuestion();
    const questionB = randomQuestion();

    const component = render(QuestionDetails, {
        dataPoints: {
            correct: [],
            incorrect: [
                { question: questionA, when: moment() } ,
                { question: questionA, when: moment() } ,
                { question: questionA, when: moment() } ,
                { question: questionB, when: moment() } ,
            ],
        },
    }, defaultProps);

    const strings = getAllRenderedStrings(component);
    expect(strings).toEqual(expect.arrayContaining([expect.stringContaining('confused')]));
    expect(strings).toEqual(expect.arrayContaining([questionA.answer, questionB.answer]));
});
