// @flow

import React from 'react';
import { Image, TouchableHighlight, Text } from 'react-native';
import { ActivityIndicator } from './ActivityIndicator.js';
import { PhotographicAffectMeter } from './PhotographicAffectMeter.js';
import { StandardButton, SecondaryButton } from './Buttons.js';
import { render } from '../../tests/render-utils.js';
import { findChildren, stringifyComponent, getAllRenderedStrings } from '../../tests/component-tree-utils.js';
import { checkNextTick, failFast } from '../../tests/utils.js';


const defaultProps = {
    emotionImages: {
        a: ['a', 'aa', 'aaa'],
        b: ['b', 'bb', 'bbb'],
        c: ['c', 'cc', 'ccc'],
    },
    onAnswered: jest.fn,
    backendFacade: {
        registerCurrentEmotion: jest.fn( (_a, cb) => cb(null) ),
    },
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
    if (!selected) throw new Error("Unable to find the selected image");

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
    const registerCurrentEmotionMock = jest.fn( (_a, cb) => cb(null) );

    const props = {
        backendFacade: {
            registerCurrentEmotion: registerCurrentEmotionMock,
        },
    };
    const { component, emotion } = renderAndSubmit(props);

    expect(registerCurrentEmotionMock).toHaveBeenCalledTimes(1);
    expect(registerCurrentEmotionMock.mock.calls[0][0]).toEqual(emotion);
});

it('disables the images while submitting', () => {
    const registerCurrentEmotionMock = jest.fn();  // never invoke the callback
    const props = {
        backendFacade: {
            registerCurrentEmotion: registerCurrentEmotionMock,
        },
    };
    const { component } = renderAndSubmit(props);

    const touchables = findChildren(component, TouchableHighlight);
    touchables.forEach(t => expect(t.props.disabled).toBe(true));
});

it('indicates that it is submitting', () => {
    const registerCurrentEmotionMock = jest.fn();  // never invoke the callback
    const component = render(PhotographicAffectMeter, {
        backendFacade: {
            registerCurrentEmotion: registerCurrentEmotionMock,
        },
    }, defaultProps);


    expect(component).not.toHaveChild(ActivityIndicator);


    selectEmotion(component);
    findSubmitButton(component).props.onPress();


    expect(component).toHaveChild(ActivityIndicator);
});

it('shows errors on submit failure', () => {
    const registerCurrentEmotionMock = jest.fn( (_a, cb) => cb(new Error('foo')) );
    const props = {
        backendFacade: {
            registerCurrentEmotion: registerCurrentEmotionMock,
        },
    };
    const { component } = renderAndSubmit(props);

    const texts = findChildren(component, Text)
        .map(t => t.props.children);

    expect(texts).toEqual(expect.arrayContaining([
        expect.stringMatching(/\bfoo\b/),
    ]));
});

it('allows retry on submit failure', () => {
    const registerCurrentEmotionMock = jest.fn( (_a, cb) => cb(new Error('foo')) );
    const props = {
        backendFacade: {
            registerCurrentEmotion: registerCurrentEmotionMock,
        },
    };
    const { component } = renderAndSubmit(props);

    return checkNextTick(() =>{
        expect(findSubmitButton(component).props.disabled).toBe(false);
    });
});

it('has a show-new-images button that replaces all the images', () => {
    const component = render(PhotographicAffectMeter, {}, defaultProps);

    const showNewImagesButton = findChildren(component, SecondaryButton)
        .find(b => b.props.testName === 'newImages');

    if(!showNewImagesButton) {
        throw new Error("Unable to find the show-new-images button");
    }

    for (let i=0; i < 50; i++) {
        const imagesBefore = findChildren(component, Image).map(i => i.props.source.uri);
        showNewImagesButton.props.onPress();
        const imagesAfter = findChildren(component, Image).map(i => i.props.source.uri);

        const hasAtLeastOneElementInCommon = imagesAfter.some(i => imagesBefore.includes(i));
        if (hasAtLeastOneElementInCommon) throw new Error('Expected all images to be changed\n\n  Got: ' + imagesBefore.join(', ') + '\n  and: ' + imagesAfter.join(', '));
    }
});

it('allows the emotion to be changed after submitting', () => {
    const registerCurrentEmotionMock = jest.fn( (_a, cb) => {
        cb(null);
        return 'foo';
    });
    const props = {
        backendFacade: {
            registerCurrentEmotion: registerCurrentEmotionMock,
        },
    };

    const { component, emotion: firstEmotion } = renderAndSubmit(props);

    return checkNextTick(() => {
            const btn = findSubmitButton(component);

            expect(btn.props.disabled).toBeFalsy();
            selectAnotherEmotion(component, firstEmotion);
        }).
        then( () => {
            findSubmitButton(component).props.onPress();
        })
        .then( () => {
            const firstInvocationId = registerCurrentEmotionMock.mock.calls[0][2];
            const secondInvocationId = registerCurrentEmotionMock.mock.calls[1][2];

            expect(firstInvocationId).toBe(null);
            expect(secondInvocationId).toBe('foo');
        });
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

it('disables the skip button while submitting', () => {
    const { component } = renderAndSubmit({
        onSkip: jest.fn(),
        backendFacade: {
            registerCurrentEmotion: jest.fn(),  // never invoke the callback
        },
    });

    const buttons = findChildren(component, StandardButton);
    const skipButton = buttons.find(b => b.props.title === 'Skip');

    if (!skipButton) throw new Error('Unable to find the skip button');

    expect(skipButton.props.disabled).toBe(true);
});

it('removes the skip button when submitted', () => {
    const { component } = renderAndSubmit({
        onSkip: jest.fn(),
    });

    const buttons = findChildren(component, StandardButton);
    const skipButton = buttons.find(b => b.props.title === 'Skip');

    expect(skipButton).toBeUndefined();
});

it('invokes the onAnswered prop to finish everything off', () => {
    const registerCurrentEmotionMock = jest.fn( (_a, cb) => cb(null) );
    const props = {
        onAnswered: jest.fn(),
        backendFacade: {
            registerCurrentEmotion: registerCurrentEmotionMock,
        },
    };
    const { component } = renderAndSubmit(props);

    return checkNextTick(() => {
        findSubmitButton(component).props.onPress();
        expect(props.onAnswered).toHaveBeenCalledTimes(1);
    });
});

it('renders the emotion images in the correct order', () => {
    const emotionImages = {
        // This is the order we want
        afraid: ['afraid'],
        tense: ['tense'],
        excited: ['excited'],
        delighted: ['delighted'],
        frustrated: ['frustrated'],
        angry: ['angry'],
        happy: ['happy'],
        glad: ['glad'],
        miserable: ['miserable'],
        sad: ['sad'],
        calm: ['calm'],
        satisfied: ['satisfied'],
        gloomy: ['gloomy'],
        tired: ['tired'],
        sleepy: ['sleepy'],
        serene: ['serene'],
    };
    const component = render(PhotographicAffectMeter, {
            emotionImages,
        },
        defaultProps
    );

    const images = findChildren(component, Image);

    // For some reason I do not understand this returns the images in reverse order...
    const sources = images.map(i => i.props.source.uri).reverse();

    expect(sources).toEqual(Object.keys(emotionImages));
});

it('ask "did you mean x?" when changing emotion after submission', () => {
    const { component, emotion } = renderAndSubmit();
    const otherEmotion = selectAnotherEmotion(component, emotion);

    const strings = getAllRenderedStrings(component);
    expect(strings).toEqual(expect.arrayContaining([
        expect.stringMatching(new RegExp("did you mean " + otherEmotion + "?", "i"))
    ]));
});

it('changes the submit button text to "change" when changing emotion after submission', () => {
    const { component, emotion } = renderAndSubmit();
    selectAnotherEmotion(component, emotion);

    expect(findSubmitButton(component).props.title.toLowerCase()).toBe('change');
});

it('shows a nah-it-was-correct button when changing emotion after submission which invokes the onAnswered prop when pressed', () => {
    const onAnswered = jest.fn();
    const { component, emotion } = renderAndSubmit({ onAnswered });
    selectAnotherEmotion(component, emotion);

    const btn = findChildren(component, StandardButton).find(b => b.props.testName === 'nah-correct');
    if (!btn) throw new Error('Found no nah-correct button');
    btn.props.onPress();

    expect(onAnswered).toHaveBeenCalledTimes(1);
});

it('highlights the first emotion when changing emotion after submission', () => {
    const { component, emotion: submittedEmotion } = renderAndSubmit();
    selectAnotherEmotion(component, submittedEmotion);

    const touchables = findChildren(component, TouchableHighlight);
    const submitted = touchables.find(t => t.props.testName === submittedEmotion);
    const others = touchables.filter(t => t.props.testName !== submittedEmotion);

    if (!submitted) throw new Error('Unable to find the touchable for the submitted emotion');

    expect(others.length).toBeGreaterThan(1);
    for (const other of others) {
        expect(other.props.style).not.toEqual(submitted.props.style);
    }
});

function renderAndSubmit(props = {}): {
    component: React.Component<*, *>,
    emotion: string,
}{
    const component = render(PhotographicAffectMeter, props, defaultProps);
    const emotion = selectEmotion(component);

    findSubmitButton(component).props.onPress();

    return { component, emotion };
}

function selectEmotion(component): string {
    const touchables = findChildren(component, TouchableHighlight);
    if (touchables.length === 0) {
        throw new Error("Found no touchables");
    }

    const toSelect = touchables[0];
    toSelect.props.onPress();

    return toSelect.props.testName;
}

function selectAnotherEmotion(component, firstEmotion): string {
    const touchables = findChildren(component, TouchableHighlight);
    if (touchables.length === 0) {
        throw new Error("Found no touchables");
    }

    for (const touchable of touchables) {
        const name = touchable.props.testName;
        if (name !== firstEmotion) {
            touchable.props.onPress();
            return name;
        }
    }

    throw new Error("Found no other emotion than " + firstEmotion);
}

function findSubmitButton(component: React.Component<*, *>) {
    const btn = findChildren(component, StandardButton)
        .find(t => t.props.testName === 'submitButton');

    if (btn) {
        return btn;
    } else {
        throw new Error("Unable to find the submit button");
    }
}

