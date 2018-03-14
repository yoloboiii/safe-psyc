// @flow

import type { Emotion } from '../models/emotion.js';
import type { EyeQuestion, IntensityQuestion } from '../models/questions.js';
import type { AnswerService } from '../services/answer-service.js';
import type { ReferencePointService } from '../services/reference-point-service.js';

export function generateEyeQuestion(emotion: Emotion, answerService: AnswerService): EyeQuestion {
    const image = emotion.image;
    if (!image) {
        throw Error('Attempted to create eye question from emotion without image. ' + emotion.name);
    }

    return {
        type: 'eye-question',
        correctAnswer: emotion,
        answers: answerService.getAnswersTo(emotion, 3),
        image: image,
    };
}

export function generateIntensityQuestion(
    emotion: Emotion,
    referencePointService: ReferencePointService
): { question: IntensityQuestion, isValid: boolean } {
    const { refPoints, isValid } = referencePointService.getReferencePointsTo(emotion);

    return {
        question: {
            type: 'intensity',
            correctAnswer: emotion,
            referencePoints: refPoints,
        },
        isValid,
    };
}
