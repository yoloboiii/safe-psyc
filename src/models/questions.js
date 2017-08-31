// @flow

export type Question = EyeQuestion | EmotionWordQuestion;

export type EyeQuestion = {
    type: 'eye-question',
    image: string,
    answer: string,
};

export type EmotionWordQuestion {
    type: 'word-question',
    questionText: 'string',
    answer: string,
};
