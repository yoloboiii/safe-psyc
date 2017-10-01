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
        referencePoints: [],
    };

    it('renders the reference points', () => {
        const referencePoints = new Map();
        referencePoints.set(1, uuid.v4());
        referencePoints.set(2, uuid.v4());
        referencePoints.set(3, uuid.v4());

        const referencePointsTitles = referencePoints.map(p => p.title);

        const component = render(IntensityScale, {
            referencePoints: referencePoints,
        }, defaultProps);

        expect(
            getAllRenderedStrings(component).sort()
        ).toEqual(
            expect.arrayContaining(referencePointsTitles.sort())
        );
    });

    it('registers clicks on the scale correctly', () => {
        const onPressMock = jest.fn();
        const component = render(IntensityScale, {
            onPress: onPressMock,
        }, defaultProps);

        const pressables = findChildren(component, TouchableOpacity);
        if (pressables.length < 10) {
            throw new Error('Not enough pressables!');
        }

        //console.log(pressables.map(p => p.props));
        const intensity2 = pressables.filter(p => p.props.intensity === 2)[0];
        const intensity5 = pressables.filter(p => p.props.intensity === 5)[0];

        intensity2.props.onPress();
        expect(onPressMock).toHaveBeenCalledWith(2);

        onPressMock.mockClear();
        intensity5.props.onPress();
        expect(onPressMock).toHaveBeenCalledWith(5);
    });
});
