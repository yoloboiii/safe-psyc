// @flow

import uuid from 'uuid';
import { Emotion, EmotionBuilder } from '../src/models/emotion.js';

export function randomEmotions(num: number): Array<Emotion> {
    const es = [];
    for (let i = 0; i < num; i++) {
        es.push(randomEmotion());
    }
    return es;
}

export function randomEmotion(name: string = uuid.v4()): Emotion {
    return new Emotion(name);
}

export function randomEmotionWithImage(name?: string) {
    name = name === undefined
        ? uuid.v4()
        : name;

    return new EmotionBuilder()
        .withName(name)
        .withImage('image' + name)
        .build();
}

export function randomEmotionWithoutImage() {
    const id = Math.random();
    return new EmotionBuilder()
        .withName(uuid.v4())
        .build();
}
