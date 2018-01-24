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

it('chooses reference points closest to the answer emotion', () => {
    const src = randomEmotionWithCoordinates();
    // $FlowFixMe
    src.coordinates.polar = 0;

    const close = emotionsCloseTo(src, 3).map((e, i) => {
        const bucket = i % 3;
        const offset = bucket === 0 ? 1 : 0;

        // $FlowFixMe
        e.coordinates.intensity = bucket * 5 + offset;

        return e;
    });

    const far = emotionsFarFrom(src, 8).map((e, i) => {
        const bucket = i % 3;
        const offset = bucket === 0 ? 1 : 0;

        // $FlowFixMe
        e.coordinates.intensity = bucket * 5 + offset;

        return e;
    });

    // $FlowFixMe
    const service = new ReferencePointService([...close, ...far, src]);
    const refPoints = Array.from(service.getReferencePointsTo(src).values());

    expect(refPoints).toEqual(expect.arrayContaining(close));
    expect(refPoints).not.toEqual(expect.arrayContaining(far));
});

function emotionsCloseTo(src, n) {
    const emotions = [];
    for (let i = -n / 2; i < n / 2; i++) {
        if (i === 0) continue;

        const e = randomEmotionWithCoordinates();
        emotions.push(e);

        // $FlowFixMe
        e.coordinates.polar = wrap(src.coordinates.polar + i, 360);
    }

    return emotions;
}

function emotionsFarFrom(src, n) {
    const emotions = [];
    for (let i = -n / 2; i < n / 2; i++) {
        if (i === 0) continue;

        const e = randomEmotionWithCoordinates();
        emotions.push(e);

        // $FlowFixMe
        e.coordinates.polar = wrap(src.coordinates.polar + (i * 5 + 100), 360);
    }

    return emotions;
}

function wrap(n, maxValue) {
    return ((n%maxValue)+maxValue)%maxValue;
};
