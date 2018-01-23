// @flow

import type { Emotion } from '../models/emotion.js';

export class ReferencePointService {
    _emotionPool: Array<Emotion>;

    constructor(emotionPool: Array<Emotion>) {
        this._emotionPool = emotionPool;
    }

    getReferencePointsTo(emotion: Emotion): Map<number, Emotion> {
        const refPoints = new Map();

        const emotions = this._emotionPool
            .sort((a, b) => {
                return polarDistance(emotion.coordinates, a.coordinates) - polarDistance(emotion.coordinates, b.coordinates);
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

function polarDistance(c1: any, c2: any) {
    if (c1 === null || c2 === null) {
        return 10000;
    }

    const r1 = c1.intensity;
    const a1 = c1.polar;

    const r2 = c2.intensity;
    const a2 = c2.polar;

    const powd = Math.pow(r1, 2) + Math.pow(r2, 2);
    const cosd = 2 * r1 * r2 * Math.cos(a1 - a2);

    return Math.sqrt(powd - cosd);
}

