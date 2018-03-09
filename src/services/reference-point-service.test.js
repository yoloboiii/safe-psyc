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
    const polar = 0;
    // $FlowFixMe
    src.coordinates.polar = polar;

    const close = [
        randomEmotionWithCoordinates({ intensity: 1, polar: polar + 15 }),
        randomEmotionWithCoordinates({ intensity: 5, polar: polar }),
        randomEmotionWithCoordinates({ intensity: 10, polar: polar - 15 }),
    ];

    const far = [
        randomEmotionWithCoordinates({ intensity: 1, polar: polar + 30 }),
        randomEmotionWithCoordinates({ intensity: 5, polar: polar - 30 }),
        randomEmotionWithCoordinates({ intensity: 10, polar: polar - 45 }),
    ];

    // $FlowFixMe
    const service = new ReferencePointService([...close, ...far, src]);
    const refPoints = Array.from(service.getReferencePointsTo(src).values());

    expect(refPoints).toEqual(expect.arrayContaining(close));
    expect(refPoints).not.toEqual(expect.arrayContaining(far));
});

it('gives either 1,3,5 or 2,4 reference points or warns if it is unable', () => {
    expect(true).toBe(false);
});
