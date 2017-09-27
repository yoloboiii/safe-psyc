// @flow

import { EmotionDetails, StrengthMeter } from './EmotionDetails.js';
import { render } from '../../tests/render-utils.js';
import { randomEmotion, randomEmotionWithImage } from '../../tests/emotion-utils.js';
import { getAllRenderedStrings } from '../../tests/component-tree-utils.js';
import { Image } from 'react-native';
import moment from 'moment';

const defaultProps = {
    emotion: randomEmotion(0, 'EMOTION NAME'),
    dataPoints: {
        correct: [],
        incorrect: [],
    },
};

it('contains the image and name of an emotion with an image', () => {
    const emotion = randomEmotionWithImage();
    const component = render(EmotionDetails, { emotion }, defaultProps);

    expect(component).toHaveChildWithProps(Image, { source: {uri: emotion.image }});
    expect(getAllRenderedStrings(component)).toEqual(expect.arrayContaining([emotion.name]));
});

it('contains a strength meter', () => {
    const component = render(EmotionDetails, {
        dataPoints: {
            correct: [moment(), moment(), moment(), moment()],
            incorrect: [],
        },
    }, defaultProps);

    expect(component).toHaveChild(StrengthMeter);
});

it('is humble about the strength meter when there\'s not enough data', () => {
    const component = render(EmotionDetails, {
        dataPoints: {
            correct: [],
            incorrect: [],
        },
    }, defaultProps);

    expect(component).not.toHaveChild(StrengthMeter);
});

it('shows emotions that the user often confuse with the main emotion', () => {
    const emotionA = randomEmotion(1, 'EMOTION A');
    const emotionB = randomEmotion(2, 'EMOTION B');

    const component = render(EmotionDetails, {
        dataPoints: {
            correct: [],
            incorrect: [
                { emotion: emotionA, when: moment() } ,
                { emotion: emotionA, when: moment() } ,
                { emotion: emotionA, when: moment() } ,
                { emotion: emotionB, when: moment() } ,
            ],
        },
    }, defaultProps);

    const strings = getAllRenderedStrings(component);
    expect(strings).toEqual(expect.arrayContaining([expect.stringContaining('confused')]));
    expect(strings).toEqual(expect.arrayContaining([emotionA.name, emotionB.name]));
});
