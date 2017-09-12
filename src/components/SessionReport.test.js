// @flow

import { SessionReport } from './SessionReport.js';
import { Image } from 'react-native';

import { render } from '../../tests/render-utils.js';
import { randomEyeQuestions, randomWordQuestions } from '../../tests/question-utils.js';
import { stringifyComponent, findChildren, getAllRenderedStrings } from '../../tests/component-tree-utils.js';

it('contains all images of eye-questions', () => {
    const eyeQuestions = randomEyeQuestions(5);
    const report = createReportWithNoWrongAnswers(
        eyeQuestions.concat(randomWordQuestions(5))
    );

    const component = render(SessionReport, { report: report });

    const questionImages = eyeQuestions.map(q => q.image);
    const images = findChildren(component, Image)
        .map(image => image.props.source.uri);

    expect(images).toHaveLength(questionImages.length);
    expect(images).toEqual(expect.arrayContaining(questionImages));
});

it('contains the question text of word-questions', () => {
    const wordQuestions = randomWordQuestions(5);
    const report = createReportWithNoWrongAnswers(
        wordQuestions.concat(randomEyeQuestions(5))
    );

    const component = render(SessionReport, { report: report });

    const questionTexts = wordQuestions.map(q => q.questionText);
    const renderedTexts = getAllRenderedStrings(component);

    expect(renderedTexts).toEqual(expect.arrayContaining(questionTexts));
});

function createReportWithNoWrongAnswers(questions) {
    const report = new Map();
    questions.forEach(q => report.set(q, []));
    return report;
}
