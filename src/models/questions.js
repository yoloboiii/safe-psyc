// @flow

export type Question = EyeQuestion | EmotionWordQuestion;

export type EyeQuestion = {
    type: 'eye-question',
    image: string,
    answer: string,
};

export type EmotionWordQuestion = {
    type: 'word-question',
    questionText: string,
    answer: string,
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
