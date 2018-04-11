// @flow

import { TouchableOpacity } from 'react-native';
import { IntensityQuestionRow } from './SessionReport.IntensityRow.js';
import { SnapSlider } from '~/src/components/lib/SnapSlider.js';
import { render } from '~/tests/render-utils.js';
import { randomIntensityQuestion } from '~/tests/question-utils.js';

const defaultProps = {
    question: randomIntensityQuestion(),
    wrongAnswers: [],
};

it('is touchable', () => {
    const props = {
        onPress: jest.fn(),
    };
    const component = render(IntensityQuestionRow, props, defaultProps);

    const rootComponent = component.toTree().rendered;
    const rootComponentType = rootComponent.type;
    expect(rootComponentType).toBe(TouchableOpacity);

    rootComponent.props.onPress();

    expect(props.onPress).toHaveBeenCalledTimes(1);
});

it('shows the slider', () => {
    const component = render(IntensityQuestionRow, {}, defaultProps);
    expect(component).toHaveChild(SnapSlider);
});
