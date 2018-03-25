// @flow

import uuid from 'uuid';
import { Emotion, EmotionBuilder } from '../src/models/emotion.js';

import type { Coordinates } from '../src/models/emotion.js';

export function randomEmotions(num: number): Array<Emotion> {
    const es = [];
    for (let i = 0; i < num; i++) {
        es.push(randomEmotion());
    }
    return es;
}

export function randomEmotion(name: string = uuid.v4(), description: string = uuid.v4()): Emotion {
    return baseBuilder(name, description).build();
}

function baseBuilder(name: string = uuid.v4(), description: string = uuid.v4()) {
    return new EmotionBuilder()
        .withName(name)
        .withImage('image-' + name)
        .withCoordinates({
            intensity: Math.floor(Math.random() * 10),
            polar: Math.floor(Math.random() * 10),
        })
        .withDescription(description);
}

export function randomEmotionWithImage(name?: string) {
    name = name === undefined
        ? uuid.v4()
        : name;

    return baseBuilder(name)
        .withImage('image' + name)
        .build();
}

export function randomEmotionWithoutImage() {
    return baseBuilder()
        .withDescription(uuid.v4())
        .build();
}

export function randomEmotionWithCoordinates(coordinates: ?Coordinates) {
    return baseBuilder()
        .withCoordinates(coordinates || {
            intensity: Math.floor(Math.random() * 10),
            polar: Math.floor(Math.random() * 10),
        })
        .build();
}
