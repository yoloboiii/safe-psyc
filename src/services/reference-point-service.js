// @flow

import { log } from '~/src/services/logger.js';
import { intensityToGroup } from '~/src/utils/intensity-utils.js';

import type { Emotion } from '~/src/models/emotion.js';

export class ReferencePointService {
    _emotionPool: Array<Emotion>;

    constructor(emotionPool: Array<Emotion>) {
        this._emotionPool = emotionPool.filter(e => !!e.coordinates);
    }

    getReferencePointsTo(emotion: Emotion): {
        refPoints: Map<number, Emotion>,
        isValid: boolean,
    } {
        const refPoints = new Map();

        const { coordinates: refEmotionCoords } = emotion;
        if (!refEmotionCoords) {
            log.warn(
                'Tried to get reference points to an emotion without coordinates, ',
                emotion.name
            );
            return { refPoints, isValid: false };
        }

        for (const e of this._emotionPool) {
            if (e === emotion) continue;

            const { coordinates: otherCoords } = e;
            if (!otherCoords) continue;

            const distance = Math.abs(refEmotionCoords.polar - otherCoords.polar);
            const isCloseEnough = distance <= 15;

            if (isCloseEnough) {
                const group = intensityToGroup(otherCoords.intensity);
                //console.log(emotion.polarity(), e.coordinates, distance, e.name);
                if (!refPoints.has(group)) {
                    refPoints.set(group, e);
                    if (refPoints.size >= 5) break;
                }
            }
        }

        const isValid = removeSuperflousPointsAndValidate(refPoints);

        if (!isValid) {
            log.warn('Did not find enough reference points for %s', emotion.name);
        }

        return { refPoints, isValid };
    }
}

function removeSuperflousPointsAndValidate(m) {
    if (m.has(1) && m.has(3) && m.has(5)) {
        m.delete(2);
        m.delete(4);

        return true;
    }

    if (m.has(2) && m.has(4)) {
        m.delete(1);
        m.delete(3);
        m.delete(5);

        return true;
    }

    return false;
}
