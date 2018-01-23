// @flow

import { ReferencePointService } from './reference-point-service.js';
import { randomEmotionWithCoordinates } from '../../tests/emotion-utils.js';

it("doesn't include the correct answer in the reference points", () => {
    const e1 = randomEmotionWithCoordinates();
    const e2 = randomEmotionWithCoordinates();
    // These intensities have to match the intensities selected by
    // the service. TODO: write test for that
    e1.coordinates = {
        intensity: 1,
        polar: 1,
    };
    e2.coordinates = {
        intensity: 5,
        polar: 1,
    };

    const service = new ReferencePointService([e1, e2]);

    const refPoints = service.getReferencePointsTo(e1).values();
    expect(refPoints).not.toContain(e1);
});

fit('chooses reference points closest to the answer emotion', () => {
    const src = randomEmotionWithCoordinates();
    // $FlowFixMe
    src.coordinates.polar = 0;

    const refCandidates = [...emotionsCloseTo(src, 8), ...emotionsFarFrom(src, 8)]
        .map( (e, i) => {
            const bucket = i % 3;
            const offset = bucket === 0 ? 1 : 0;
            e.coordinates.intensity = bucket * 5 + offset;

            return e;
        })
        .sort((a, b) => {
            return polarDistance(src.coordinates, a.coordinates) - polarDistance(src.coordinates, b.coordinates);
        })
        .map( e => {
            //console.log(e.name, polarDistance(src.coordinates, e.coordinates));
            return e;
        });
    console.log(refCandidates);


    const service = new ReferencePointService([...refCandidates, src]);
    const refPoints = Array.from(service.getReferencePointsTo(src).values());
    console.log(refPoints);

    expect(refPoints).toEqual(refCandidates.slice(0,3));
});

function emotionsCloseTo(src, n) {
    const emotions = [];
    for (let i = -n/2; i < n/2; i++) {
        if (i === 0) continue;

        const e = randomEmotionWithCoordinates();
        emotions.push(e);

        // $FlowFixMe
        e.coordinates.polar = src.coordinates.polar + i;
    }

    return emotions;
}

function emotionsFarFrom(src, n) {
    const emotions = [];
    for (let i = -n/2; i < n/2; i++) {
        if (i === 0) continue;

        const e = randomEmotionWithCoordinates();
        emotions.push(e);

        // $FlowFixMe
        e.coordinates.polar = src.coordinates.polar + (i * 5);
    }

    return emotions;
}

function polarDistance(c1: any, c2: any) {
    const r1 = c1.intensity;
    const a1 = c1.polar;

    const r2 = c2.intensity;
    const a2 = c2.polar;

    const powd = Math.pow(r1, 2) + Math.pow(r2, 2);
    const cosd = 2 * r1 * r2 * Math.cos(a1 - a2);

    return Math.sqrt(powd - cosd);
}

