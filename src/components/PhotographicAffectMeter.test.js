// @flow

import { Image, TouchableHighlight, Text, ActivityIndicator } from 'react-native';
import { PhotographicAffectMeter } from './PhotographicAffectMeter.js';
import { StandardButton } from './Buttons.js';
import { render } from '../../tests/render-utils.js';
import { findChildren, stringifyComponent } from '../../tests/component-tree-utils.js';
import { checkNextTick } from '../../tests/utils.js';


const defaultProps = {
    emotionImages: {
        a: ['a', 'aa', 'aaa'],
        b: ['b', 'bb', 'bbb'],
    },
    onAnswered: jest.fn,
};

it('shows all the images', () => {
    const component = render(PhotographicAffectMeter, {
            emotionImages: {
                a: ['a', 'aa', 'aaa'],
                b: ['b', 'bb', 'bbb'],
            },
        },
        defaultProps
    );

    const images = findChildren(component, Image);
    const sources = images.map(i => i.props.source.uri);

    expect(sources).toEqual(expect.arrayContaining([
        expect.stringMatching(/a+/),
        expect.stringMatching(/b+/),
    ]));
    expect(sources).toHaveLength(2);
});

it('makes all images pressable', () => {
    const component = render(PhotographicAffectMeter, {}, defaultProps);

    const touchables = findChildren(component, TouchableHighlight);
    touchables.forEach(t => {
        expect(t).toHaveChild(Image);
    });

    expect(touchables).toHaveLength(Object.keys(defaultProps.emotionImages).length);
});

it('highlights the selected image', () => {
    const component = render(PhotographicAffectMeter, {}, defaultProps);

    const touchables = findChildren(component, TouchableHighlight);
    const toSelect = touchables[0];
    const unselectedStyle = toSelect.props.style;


    toSelect.props.onPress();


    const selected = findChildren(component, TouchableHighlight)
        .find(t => t.props.testName === toSelect.props.testName);

    const allOther = findChildren(component, TouchableHighlight)
        .filter(t => t.props.testName !== selected.props.testName);


    expect(allOther.length).toBeGreaterThan(0);

    expect(selected.props.style).not.toEqual(unselectedStyle);

    allOther.forEach(a => {
        expect(a.props.style).toEqual(unselectedStyle);
    });
});

it('shows the name of the selected emotion somewhere', () => {
    const component = render(PhotographicAffectMeter, {}, defaultProps);
    const emotion = selectEmotion(component);

    const texts = findChildren(component, Text)
        .map(t => t.props.children);

    expect(texts).toEqual(expect.arrayContaining([
        expect.stringMatching("\\b" +emotion+ "\\b"),
    ]));
});

it('disables the submit button until an emotion is selected', () => {
    const component = render(PhotographicAffectMeter, {}, defaultProps);
    const submitButton = findSubmitButton(component);

    expect(findSubmitButton(component).props.disabled).toBe(true);
    selectEmotion(component);
    expect(findSubmitButton(component).props.disabled).toBe(false);
});

it('submits the selected emotion', () => {
    const registerCurrentEmotionMock = jest.fn()
        .mockReturnValue(Promise.resolve());

    const component = render(PhotographicAffectMeter, {
        backendFacade: {
            registerCurrentEmotion: registerCurrentEmotionMock,
        },
    }, defaultProps);


    const emotion = selectEmotion(component);
    findSubmitButton(component).props.onPress();


    expect(registerCurrentEmotionMock).toHaveBeenCalledTimes(1);
    expect(registerCurrentEmotionMock).toHaveBeenCalledWith(emotion);
});

it('disables the images while submitting', () => {
    const component = render(PhotographicAffectMeter, {
        backendFacade: {
            registerCurrentEmotion: () => new Promise(jest.fn()), // a promise that never resolves
        },
    }, defaultProps);

    selectEmotion(component);
    findSubmitButton(component).props.onPress();

    const touchables = findChildren(component, TouchableHighlight);
    touchables.forEach(t => expect(t.props.disabled).toBe(true));
});

it('indicates that it is submitting', () => {
    const component = render(PhotographicAffectMeter, {
        backendFacade: {
            registerCurrentEmotion: () => new Promise(jest.fn()), // a promise that never resolves
        },
    }, defaultProps);


    expect(component).not.toHaveChild(ActivityIndicator);


    selectEmotion(component);
    findSubmitButton(component).props.onPress();


    expect(component).toHaveChild(ActivityIndicator);
});

it('shows errors on submit failure', () => {
    const component = render(PhotographicAffectMeter, {
        backendFacade: {
            registerCurrentEmotion: () => Promise.reject(new Error('foo')),
        },
    }, defaultProps);
    selectEmotion(component);
    findSubmitButton(component).props.onPress();


    const texts = findChildren(component, Text)
        .map(t => t.props.children);

    expect(texts).toEqual(expect.arrayContaining([
        expect.stringMatching(/\bfoo\b/),
    ]));
});

it('allows retry on submit failure', (done) => {
    const component = render(PhotographicAffectMeter, {
        backendFacade: {
            registerCurrentEmotion: () => Promise.reject(new Error('foo')),
        },
    }, defaultProps);
    selectEmotion(component);
    findSubmitButton(component).props.onPress();

    checkNextTick(done, () =>{
        expect(findSubmitButton(component).props.disabled).toBe(false);
    });
});

it('has a show-new-images button', () => {
    expect(true).toBe(false);
});

it('allows the emotion to be changed after submitting', () => {
    expect(true).toBe(false);
});

it('doesn\'t show a skip button if no onSkip prop is given', () => {
    const component = render(PhotographicAffectMeter, {
        onSkip: null,
    }, defaultProps);

    const buttons = findChildren(component, StandardButton);
    const skipButton = buttons.find(b => b.props.title === 'Skip');

    expect(skipButton).toBeUndefined();
});

it('shows a skip button if the onSkip prop is given', () => {
    const component = render(PhotographicAffectMeter, {
        onSkip: jest.fn(),
    }, defaultProps);

    const buttons = findChildren(component, StandardButton);
    const skipButton = buttons.find(b => b.props.title === 'Skip');

    expect(skipButton).not.toBeUndefined();
});

it('invokes the onAnswered prop to finish everything off', () => {
    expect(true).toBe(false);
});

function selectEmotion(component): string {
    const touchables = findChildren(component, TouchableHighlight);
    const toSelect = touchables[0];
    toSelect.props.onPress();

    return toSelect.props.testName;
}

function findSubmitButton(component) {
    return findChildren(component, StandardButton)
        .find(t => t.props.testName === 'submitButton');
}
