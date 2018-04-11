// @flow

import { log } from '~/src/services/logger.js';
import { ReferencePointService } from './reference-point-service.js';
import { randomEmotionWithCoordinates } from '~/tests/emotion-utils.js';

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

    const refPoints = service.getReferencePointsTo(e1).refPoints.values();
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
    const refPoints = Array.from(service.getReferencePointsTo(src).refPoints.values());

    expect(refPoints).toEqual(expect.arrayContaining(close));
    expect(refPoints).not.toEqual(expect.arrayContaining(far));
});

it('prefers points at 1,3,5 over 2,4', () => {

    const src = randomEmotionWithCoordinates();
    const emotions = ranomEmotionsWithIntensities([1,2,3,4,5,6,7,8,9,10]);
    const service = new ReferencePointService(emotions);
    const refPoints = getRefPointNumbers(service.getReferencePointsTo(src));

    expect(refPoints).toEqual([1, 3, 5]);
});

it('accepts points at 2,4 if 1,3 or 5 is empty', () => {
    const src = randomEmotionWithCoordinates();
    const emotions = ranomEmotionsWithIntensities([3,4,5,6,7,8,9,10]);
    const service = new ReferencePointService(emotions);
    const refPoints = getRefPointNumbers(service.getReferencePointsTo(src));

    expect(refPoints).toEqual([2, 4]);
});

it('warns if unable to find enough reference points', () => {

    const src = randomEmotionWithCoordinates();
    const emotions = ranomEmotionsWithIntensities([1, 3, 5]);
    const service = new ReferencePointService(emotions);
    const refPoints = getRefPointNumbers(service.getReferencePointsTo(src));

    expect(log.warn).toHaveBeenCalledWith(expect.stringMatching(/not find enough/i), expect.anything());
    expect(refPoints).toEqual([1, 2, 3]);
});

function ranomEmotionsWithIntensities(intensities) {
    return intensities.map(i => randomEmotionWithCoordinates({ polar: 1, intensity: i }));
}

function getRefPointNumbers(serviceReturnValue) {
    const { refPoints } = serviceReturnValue;
    return Array.from(refPoints.keys());
}
