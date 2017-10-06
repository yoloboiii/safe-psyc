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
    return new EmotionBuilder()
        .withName(uuid.v4())
        .build();
}

export function randomEmotionWithIntensity() {
    const intensity = Math.floor(Math.random() * 10);
    return new EmotionBuilder()
        .withName(uuid.v4())
        .withIntensity(intensity)
        .build();
}
