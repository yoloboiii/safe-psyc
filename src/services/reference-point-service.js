// @flow

import type { Emotion } from '../models/emotion.js';

export class ReferencePointService {
    _emotionPool: Array<Emotion>;

    constructor(emotionPool: Array<Emotion>) {
        this._emotionPool = emotionPool
            .filter(e => !!e.coordinates);
    }

    getReferencePointsTo(emotion: Emotion): Map<number, Emotion> {
        const refPoints = new Map();

        const emotions = this._emotionPool
            .sort((a, b) => {
                return distance(emotion.coordinates, a.coordinates) - distance(emotion.coordinates, b.coordinates);
            });

        const f = this._findPointWithIntensity(1, emotions, emotion);
        const s = this._findPointWithIntensity(5, emotions, emotion);
        const t = this._findPointWithIntensity(10, emotions, emotion);

        if (f) refPoints.set(1, f);

        if (s) refPoints.set(3, s);

        if (t) refPoints.set(5, t);

        return refPoints;
    }

    _findPointWithIntensity(intensity: number, emotions, ignore: Emotion): ?Emotion {
        return emotions.find(
            e => e.intensity() === intensity && e !== ignore
        );
    }
}

function distance(c1: any, c2: any) {
    return Math.abs(c1.polar - c2.polar);
}

