// @flow

import { log } from '~/src/services/logger.js';

import type { Emotion, Coordinates } from '~/src/models/emotion.js';

export class ExactReferencePointService {
    _emotionPool: Array<Emotion>;

    constructor(emotionPool: Array<Emotion>) {
        this._emotionPool = emotionPool.filter(e => !!e.coordinates);
    }

    getReferencePointsTo(emotion: Emotion): Map<number, Emotion> {
        if (!emotion.coordinates) {
            throw new Error(
                'Attempted to get reference points to emotion without coordinates: ' + emotion.name
            );
        }

        const { polar } = emotion.coordinates;

        const findContext = new FindContext(this._emotionPool, emotion);
        const f = findContext.findWithCoordinates({ intensity: 1, polar });
        const s = findContext.findWithCoordinates({ intensity: 5, polar });
        const t = findContext.findWithCoordinates({ intensity: 10, polar });

        const refPoints = new Map();
        addIfSet(refPoints, 1, f);
        addIfSet(refPoints, 3, s);
        addIfSet(refPoints, 5, t);

        if (refPoints.size < 3) {
            log.warn('Did not find enough reference points for %s', emotion.name);
        }

        return refPoints;
    }
}

class FindContext {
    pool: Array<Emotion>;
    ignore: Emotion;

    constructor(pool: Array<Emotion>, ignore: Emotion) {
        this.pool = pool;
        this.ignore = ignore;
    }

    findWithCoordinates(coordinates: Coordinates): ?Emotion {
        const { pool, ignore } = this;
        const { intensity, polar } = coordinates;

        return pool.find(e => {
            const shouldIgnore = e === ignore;
            const coordsCorrect = e.intensity() === intensity && e.polarity() === polar;

            return !shouldIgnore && coordsCorrect;
        });
    }
}

function addIfSet(map, key, value) {
    if (value) map.set(key, value);

    return map;
}
