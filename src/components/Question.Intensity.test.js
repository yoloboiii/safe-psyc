// @flow

import { IntensityQuestionComponent, IntensityScale, IntensityQuestionOverlay } from './Question.Intensity.js';
import { StandardButton } from './Buttons.js'
import { render } from '../../tests/render-utils.js';
import { randomIntensityQuestion } from '../../tests/question-utils.js';
import { getAllRenderedStrings, findChildren } from '../../tests/component-tree-utils.js';
import { randomEmotionWithIntensity } from '../../tests/emotion-utils.js';
import uuid from 'uuid';
import { TouchableOpacity } from 'react-native';
import { sprintf } from 'sprintf-js';

describe('IntensityQuestionComponent', () => {
    const defaultProps = {
        question: randomIntensityQuestion(),
        onCorrectAnswer: jest.fn(),
        onWrongAnswer: jest.fn(),
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

    it('calls onCorrectAnswer when correct', () => {
        const answerMock = jest.fn();
        const question = randomIntensityQuestion();
        question.correctAnswer.intensity = 1;

        const component = render(IntensityQuestionComponent, {
            onCorrectAnswer: answerMock,
            question: question,
        }, defaultProps);

        const submitButton = findChildren(component, StandardButton)[0];
        selectIntensity(component, question.correctAnswer.intensity);

        submitButton.props.onPress();
        expect(answerMock).toHaveBeenCalledTimes(1);
    });

    it('calls onWrongAnswer when wrong', () => {
        const answerMock = jest.fn();
        const question = randomIntensityQuestion();

        const component = render(IntensityQuestionComponent, {
            onWrongAnswer: answerMock,
            question: question,
        }, defaultProps);

        const submitButton = findChildren(component, StandardButton)[0];

        const intensity = question.correctAnswer.intensity + 1;
        selectIntensity(component, intensity);

        submitButton.props.onPress();
        expect(answerMock).toHaveBeenCalledTimes(1);
        expect(answerMock).toHaveBeenCalledWith(intensity);
    });

    it('submits answers only when the button is pressed', () => {
        const answerMock = jest.fn();
        const question = randomIntensityQuestion();
        question.correctAnswer.intensity = 1;

        const component = render(IntensityQuestionComponent, {
            onCorrectAnswer: answerMock,
            question: question,
        }, defaultProps);

        const submitButton = findChildren(component, StandardButton)[0];

        selectIntensity(component, question.correctAnswer.intensity);
        expect(answerMock).not.toHaveBeenCalled();

        submitButton.props.onPress();
        expect(answerMock).toHaveBeenCalledTimes(1);
    });

    it('groups intensities correctly', () => {
        // The intensity data is ranged from 1 to 11,
        // but that resolution is too great to be user
        // friendly, so the IntensityQuestionComponent
        // should group the 1-11 scale into five buckets
        // and test if the user selects the correct
        // bucket rather than the correct intensity

        testIntensityGroup({ intensity: 1,  group: 1, });
        testIntensityGroup({ intensity: 2,  group: 1, });
        testIntensityGroup({ intensity: 3,  group: 2, });
        testIntensityGroup({ intensity: 4,  group: 2, });
        testIntensityGroup({ intensity: 5,  group: 3, });
        testIntensityGroup({ intensity: 6,  group: 3, });
        testIntensityGroup({ intensity: 7,  group: 4, });
        testIntensityGroup({ intensity: 8,  group: 4, });
        testIntensityGroup({ intensity: 9,  group: 5, });
        testIntensityGroup({ intensity: 10, group: 5, });
        testIntensityGroup({ intensity: 11, group: 5, });
    });

    it('Pressing the emotion name navigates to the emotion details', () => {
        const question = randomIntensityQuestion();
        const navigationMock = jest.fn();
        const component = render(IntensityQuestionComponent, { question }, defaultProps);

        const emotionNameComponent = findChildren(component, TouchableOpacity)
            .filter(c => getAllRenderedStrings(c) === [question.correctAnswer.name])[0];
        expect(emotionNameComponent).toBeDefined();

        emotionNameComponent.props.onPress();
        expect(navigationMock).tohaveBeenCalledWith('EmotionDetails', question.correctAnswer);
    });

    it('has a link to a textual description of the emotion in the overlay', () => {
        const askedQuestion = randomIntensityQuestion();
        const answer = randomEmotionWithIntensity();
        const navigationMock = jest.fn();

        const component = render(IntensityQuestionOverlay, {
            answeredCorrectly: false,
            question: askedQuestion,
            answer: answer,
        });

        const helpComponent = undefined;
        if (!helpComponent) {
            throw new Error('Unable to find help component');
        }

        helpComponent.props.onPress();
        expect(navigationMock).tohaveBeenCalledWith('EmotionDetails', askedQuestion.correctAnswer);
    });

    function testIntensityGroup(conf) {
        const question = randomIntensityQuestion();
        question.correctAnswer.intensity = conf.intensity;

        const correctMock = jest.fn();
        const component = render(IntensityQuestionComponent, {
            onCorrectAnswer: correctMock,
            question: question,
        }, defaultProps);

        selectIntensity(component, conf.group);

        const submitButton = findChildren(component, StandardButton)[0];
        submitButton.props.onPress();

        try {
            expect(correctMock).toHaveBeenCalled();
        } catch (e) {
            throw sprintf("expected intensity %d to be in group %d", conf.intensity, conf.group);
        }
    }

    function selectIntensity(component, intensity) {
        const instance = component.toTree().instance;
        const simulateSliderClick = instance._onIntensityChosen.bind(instance);

        simulateSliderClick(intensity);
    }
});

describe('IntensityScale', () => {
    const defaultProps = {
        referencePoints: new Map(),
    };

    it('renders the reference points', () => {
        const referencePoints = new Map();
        referencePoints.set(1, { name: uuid.v4() });
        referencePoints.set(2, { name: uuid.v4() });
        referencePoints.set(3, { name: uuid.v4() });

        const referencePointsTitles = [];
        referencePoints.forEach(value => value.name);

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
