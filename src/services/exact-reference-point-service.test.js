// @flow

import { ExactReferencePointService } from './exact-reference-point-service.js';
import { randomEmotionWithCoordinates } from '../../tests/emotion-utils.js';

it("doesn't include the correct answer in the reference points", () => {
    // These intensities have to match the intensities selected by
    // the service. TODO: write test for that
    const e1 = emotionWithIntensity(1);
    const e2 = emotionWithIntensity(5);

    const service = new ExactReferencePointService([e1, e2]);

    const refPoints = Array.from(service.getReferencePointsTo(e1).values());
    expect(refPoints).not.toContain(e1);
    expect(refPoints).not.toHaveLength(0);
});

it('only includes points with the same polarity', () => {
    const e = randomEmotionWithCoordinates({ intensity: 1, polar: 3 });

    const c1 = randomEmotionWithCoordinates({ intensity: 1, polar: 3 });
    const c2 = randomEmotionWithCoordinates({ intensity: 5, polar: 3 });
    const c3 = randomEmotionWithCoordinates({ intensity: 10, polar: 3 });

    const w1 = randomEmotionWithCoordinates({ intensity: 1, polar: 20 });
    const w2 = randomEmotionWithCoordinates({ intensity: 5, polar: 2 });
    const w3 = randomEmotionWithCoordinates({ intensity: 10, polar: 4 });

    const service = new ExactReferencePointService([e, c1, c2, c3, w1, w2, w3]);

    const refPoints = Array.from(service.getReferencePointsTo(e).values());

    expect(refPoints).toContain(c1);
    expect(refPoints).toContain(c2);
    expect(refPoints).toContain(c3);

    expect(refPoints).not.toContain(w1);
    expect(refPoints).not.toContain(w2);
    expect(refPoints).not.toContain(w3);
});

function emotionWithIntensity(intensity) {
    const e = randomEmotionWithCoordinates();
    e.coordinates = {
        intensity,
        polar: 1,
    };

    return e;
}
