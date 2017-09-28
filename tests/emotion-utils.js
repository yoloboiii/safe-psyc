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

export function randomEmotionWithImage(id?: number, name?: string) {
    id = id === undefined
        ? Math.random()
        : id;

    name = name === undefined
        ? uuid.v4()
        : name;
    return new EmotionBuilder()
        .withId(id)
        .withName(name)
        .withImage('image' + id)
        .build();
}

export function randomEmotionWithoutImage() {
    const id = Math.random();
    return new EmotionBuilder()
        .withId(id)
        .withName(uuid.v4())
        .build();
}
