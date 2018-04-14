// @flow

import type { Emotion } from '~/src/models/emotion.js';

export type AnswerType = Emotion | number;

export type IncorrectAnswer =
    | IncorrectEyeAnswer
    | IncorrectIntensityAnswer
    | IncorrectWordAnswer;
export type IncorrectEyeAnswer = {
    questionType: 'eye-question',
    answer: Emotion,
    when: moment$Moment,
};
export type IncorrectIntensityAnswer = {
    questionType: 'intensity',
    answer: number,
    when: moment$Moment,
};
export type IncorrectWordAnswer = {
    questionType: 'word',
    answer: Emotion,
    when: moment$Moment,
};

export type Question = EyeQuestion | WordQuestion | IntensityQuestion;
export type EyeQuestion = {
    type: 'eye-question',
    correctAnswer: Emotion,
    answers: Array<Emotion>,

    image: string,
|};
export type WordQuestion = {|
    type: 'word-question',
    correctAnswer: Emotion,
    answers: Array<Emotion>,
|};
export type IntensityQuestion = {
    type: 'intensity',
    correctAnswer: Emotion,
    referencePoints: Map<number, Emotion>,
};

// Place the emotion in a grid or something where the
// axes are e.g. activation and pleasure. Anger being high in
// activation and low in pleasure.
export type EmotionCoordinates = {};

// Drag slider to indicate how much of some emotions
// the person on the image is showing
export type FaceWithDifferentDegrees = {};
