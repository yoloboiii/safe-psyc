// @flow

import { render } from '../../tests/render-utils.js';
import { findChildren, stringifyComponent } from '../../tests/component-tree-utils.js';
import { Button } from 'react-native';
import { CurrentFeeling } from './CurrentFeeling.js';

const defaultProps = {
    emotionWords: ['a', 'b', 'c'],
    onAnswered: () => {},
};
it('has a list of emotion words', () => {
    const expectedWords = ['a', 'b', 'c'];
    const component = render(CurrentFeeling, {
        emotionWords: expectedWords,
    }, defaultProps);


    const wordList = findChildren(component, 'RCTPicker')[0]
        .props
        .items
        .map( i => i.value );

    expect(wordList).toEqual(expectedWords);
});

it('submits the chosen emotion to the backend', () => {
    const registerCurrentEmotionMock = jest.fn()
        .mockReturnValue(new Promise(r => r()));
    const backendFacade = {
        registerCurrentEmotion: registerCurrentEmotionMock,
    };
    const component = render(CurrentFeeling, {
        emotionWords: ['a', 'b'],
        backendFacade: backendFacade,
    }, defaultProps);

    const button = findChildren(component, Button)
        .filter(b => b.props.title === 'Submit')[0];

    button.props.onPress();
    expect(registerCurrentEmotionMock).toHaveBeenCalledTimes(1);
    expect(registerCurrentEmotionMock).toHaveBeenCalledWith('a');
});

it('contains a skip button if the onSkip prop is given', () => {
    const onSkipMock = jest.fn();
    const component = render(CurrentFeeling, {
        onSkip: onSkipMock,
    }, defaultProps);

    expect(component).toHaveChildWithProps(Button, { title: 'Skip' });

    const skipButton = findChildren(component, Button)
        .filter(b => b.props.title === 'Skip')[0];

    skipButton.props.onPress();

    expect(onSkipMock).toHaveBeenCalledTimes(1);
});
