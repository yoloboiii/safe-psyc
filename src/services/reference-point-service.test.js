// @flow

import { ReferencePointService } from './reference-point-service.js';
import { randomEmotionWithIntensity } from '../../tests/emotion-utils.js';

it('doesn\'t include the correct answer in the reference points', () => {
    const e1 = randomEmotionWithIntensity();
    const e2 = randomEmotionWithIntensity();
    // These intensities have to match the intensities selected by
    // the service. TODO: write test for that
    e1.intensity = 1;
    e2.intensity = 5;

    const service = new ReferencePointService([e1, e2]);

    const refPoints = service.getReferencePointsTo(e1).values();
    expect(refPoints).not.toContain(e1);
});
