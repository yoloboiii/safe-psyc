// @flow

import { IntensityQuestionComponent, IntensityScale } from './Question.Intensity.js';
import { render } from '../../tests/render-utils.js';
import { randomIntensityQuestion } from '../../tests/question-utils.js';
import { getAllRenderedStrings, findChildren } from '../../tests/component-tree-utils.js';
import uuid from 'uuid';
import { TouchableOpacity } from 'react-native';

describe('IntensityQuestionComponent', () => {
    const defaultProps = {
        question: randomIntensityQuestion(),
    };

    it('contains a description of the question', () => {

        const question = randomIntensityQuestion();

        const component = render(IntensityQuestionComponent, { question }, defaultProps);
        expect(getAllRenderedStrings(component)).toEqual(
            expect.arrayContaining([
                expect.stringMatching(/how intense/i),
                expect.stringMatching(question.correctAnswer.name),
            ])
        );
    });

    it('contains a scale', () => {
        const component = render(IntensityQuestionComponent, {}, defaultProps);
        expect(component).toHaveChild(IntensityScale);
    });

    it('the scale contains three reference points', () => {
        const component = render(IntensityQuestionComponent, {}, defaultProps);
        expect(component).toHaveChildMatching( child => {
            return child.type === IntensityScale
                && child.props.referencePoints.size === 3;
        });
    });
});

describe('IntensityScale', () => {
    const defaultProps = {
        referencePoints: new Map(),
    };

    it('renders the reference points', () => {
        const referencePoints = new Map();
        referencePoints.set(1, uuid.v4());
        referencePoints.set(2, uuid.v4());
        referencePoints.set(3, uuid.v4());

        const referencePointsTitles = [];
        referencePoints.forEach(value => value.title);

        const component = render(IntensityScale, {
            referencePoints: referencePoints,
        }, defaultProps);

        expect(
            getAllRenderedStrings(component).sort()
        ).toEqual(
            expect.arrayContaining(referencePointsTitles.sort())
        );
    });
});
