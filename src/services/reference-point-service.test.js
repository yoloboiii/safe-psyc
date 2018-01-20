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

it.only('chooses reference points closest to the answer emotion', () => {
    const src = randomEmotionWithCoordinates();
    const refCandidates = [];
    while (refCandidates.length < 14) {
        const e = randomEmotionWithCoordinates();
        refCandidates.push(e);

        // $FlowFixMe
        e.coordinates.polar = src.coordinates.polar + 1;
    }

    expect(true).toBe(false);
});

function emotionCloseTo(emotion) {
    const e = randomEmotionWithCoordinates();

    // TODO: Make sure to test with polar = 0 so that
    // the circular nature is tested

    // $FlowFixMe
    e.coordinates.polar = src.coordinates.polar + 1;

    return e;
}

function emotionFarFrom(emotion) {}
