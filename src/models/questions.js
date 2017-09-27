// @flow

import type { Emotion } from './emotion.js';
export type Question = EyeQuestion | EmotionWordQuestion;

export type EyeQuestion = {
    id: number,
    type: 'eye-question',
    image: string,
    emotion: Emotion,
};

export type EmotionWordQuestion = {
    id: number,
    type: 'word-question',
    questionText: string,
    emotion: Emotion,
};

// To be asked at the end of the first training session
// Nice with the coordinates thing and then being asked
// to name the emotion
export type HowAreYouFeelingToday = {};

// Place the emotion in a grid or something where the
// axes are e.g. activation and pleasure. Anger being high in
// activation and low in pleasure.
export type EmotionCoordinates = {};

// Drag slider to indicate how much of some emotions
// the person on the image is showing
export type FaceWithDifferentDegrees = {};
