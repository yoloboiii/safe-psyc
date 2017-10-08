// @flow

import type { Emotion } from '../models/emotion.js';

export class ReferencePointService {

    _emotionPool: Array<Emotion>;

    constructor(emotionPool: Array<Emotion>) {
        this._emotionPool = emotionPool;
    }

    getReferencePointsTo(emotion: Emotion): Map<number, Emotion> {
        const refPoints = new Map();

        const f = this._findPointWithIntensity(1, emotion);
        const s = this._findPointWithIntensity(5, emotion);
        const t = this._findPointWithIntensity(10, emotion);

        if (f)
            refPoints.set(1, f);

        if (s)
            refPoints.set(3, s);

        if (t)
            refPoints.set(5, t);

        return refPoints;
    }

    _findPointWithIntensity(intensity: number, ignore: Emotion): ?Emotion {
        return this._emotionPool.find(e => e.intensity === intensity && e !== ignore);
    }
}

