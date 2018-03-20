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

export function randomEmotion(name?: string, description?: string): Emotion {
    return baseBuilder(name, description).build();
}

function baseBuilder(
    name: string = 'name-' + uuid.v4(),
    description: string = 'desc-' + uuid.v4()
) {
    return new EmotionBuilder()
        .withName(name)
        .withDescription(description);
}

export function randomEmotionWithImage(name?: string) {
    const builder =  baseBuilder(name);

    return builder
        .withImage('image' + builder.name)
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
