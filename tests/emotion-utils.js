// @flow

import uuid from 'uuid';
import { Emotion, EmotionBuilder } from '../src/models/emotion.js';

export function randomEmotions(num: number): Array<Emotion> {
    const es = [];
    for (let i = 0; i < num; i++) {
        es.push(randomEmotion(i));
    }
    return es;
}

export function randomEmotion(id: number = 0, name: string = uuid.v4()): Emotion {
    return new Emotion(id, name);
}

export function randomEmotionWithImage() {
    return new EmotionBuilder()
        .withId(Math.random())
        .withName(uuid.v4())
        .withImage('image')
        .build();
}
