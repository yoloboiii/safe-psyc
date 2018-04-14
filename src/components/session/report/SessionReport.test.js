// @flow

import { SessionReport } from './SessionReport.js';
import { Image, TouchableOpacity } from 'react-native';

import { render } from '~/tests/render-utils.js';
import { mockNavigation } from '~/tests/navigation-utils.js';
import {
    randomEyeQuestion,
    randomEyeQuestions,
    randomWordQuestions,
} from '~/tests/question-utils.js';
import {
    stringifyComponent,
    findChildren,
    getAllRenderedStrings,
} from '~/tests/component-tree-utils.js';

it('contains all images of eye-questions', () => {
    const eyeQuestions = randomEyeQuestions(5);
    const report = createReportWithNoWrongAnswers(eyeQuestions.concat(randomWordQuestions(5)));

    const component = render(SessionReport, { report: report });

    const questionImages = eyeQuestions.map(q => q.image);
    const images = findChildren(component, Image).map(image => image.props.source.uri);

    expect(images).toHaveLength(questionImages.length);
    expect(images).toEqual(expect.arrayContaining(questionImages));
});

it('contains the answer name in word-questions', () => {
    const wordQuestions = randomWordQuestions(5);
    const report = createReportWithNoWrongAnswers(wordQuestions.concat(randomEyeQuestions(1)));

    const component = render(SessionReport, { report: report });

    const renderedTexts = getAllRenderedStrings(component);

    expect(renderedTexts.sort()).toEqual(
        expect.arrayContaining(
            wordQuestions
                .map(q => q.correctAnswer.name)
                .sort()
                .map(name => expect.stringContaining(name))
        )
    );
});

it('contains the answer description of word-questions', () => {
    const wordQuestions = randomWordQuestions(5);
    const report = createReportWithNoWrongAnswers(wordQuestions.concat(randomEyeQuestions(1)));

    const component = render(SessionReport, { report: report });

    const renderedTexts = getAllRenderedStrings(component);

    expect(renderedTexts.sort()).toEqual(
        expect.arrayContaining(
            wordQuestions
                .map(q => q.correctAnswer.description)
                .sort()
                .map(desc => expect.stringContaining(desc))
        )
    );
});

it('navigates to the question details when clicking the row', () => {
    const navigation = mockNavigation();

    const eyeQuestion = randomEyeQuestion();
    const report = createReportWithNoWrongAnswers([eyeQuestion]);
    const component = render(SessionReport, {
        report: report,
        navigation: navigation,
    });

    const touchable = findChildren(component, TouchableOpacity)[0];
    expect(touchable).toBeDefined();

    expect(navigation).toNeverHaveNavigated();
    touchable.props.onPress();
    expect(navigation).toHaveNavigatedTo('EmotionDetails', {
        emotion: eyeQuestion.correctAnswer,
    });
});

function createReportWithNoWrongAnswers(questions) {
    const report = new Map();
    questions.forEach(q => report.set(q, []));
    return report;
}
