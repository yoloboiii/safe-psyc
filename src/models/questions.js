// @flow

import type { Emotion } from './emotion.js';

export type Question = EyeQuestion | EmotionWordQuestion | IntensityQuestion;
export type AnswerType = Emotion | number;

export type IncorrectAnswer =
    | IncorrectEyeAnswer
    | {
          questionType: 'intensity',
          answer: number,
          when: moment$Moment,
      };
export type IncorrectEyeAnswer = {
    questionType: 'eye-question',
    answer: Emotion,
    when: moment$Moment,
};

export type EyeQuestion = {
    type: 'eye-question',
    correctAnswer: Emotion,
    answers: Array<Emotion>,

    image: string,
};

export type EmotionWordQuestion = {
    type: 'word-question',
    correctAnswer: Emotion,
    answers: Array<Emotion>,

    questionText: string,
};

export type IntensityQuestion = {
    type: 'intensity',
    correctAnswer: Emotion,
    referencePoints: Map<number, Emotion>,
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
