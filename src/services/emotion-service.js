// @flow

import { Emotion } from '~/src/models/emotion.js';

export class EmotionService {
    _emotionPool: ?Array<Emotion>;

    constructor() {
        this._emotionPool = undefined;
    }

    getEmotionPool(): Array<Emotion> {
        if (this._emotionPool === undefined) {
            const emotions = require('../../SECRETS/emotions.json')
                .filter(e => {
                    // I found that a lot of the emotions are unknown to many people
                    // so I added a link to the emotion details in the question view.
                    // This link will only help the user if the details contains a
                    // textual description of the emotion, thus I disregard all
                    // emotions without a description.
                    //
                    // I do it here instead of in generate-emotions.js to make it more
                    // explicit.
                    return !!e.description;
                })
                .map(e => new Emotion(e.name, e.description, e.image, e.coordinates));
            this._setEmotionPool(emotions);
        }

        // $FlowFixMe
        return this._emotionPool;
    }

    _setEmotionPool(emotionPool: Array<Emotion>) {
        this._emotionPool = emotionPool;
    }
}
export const emotionService = new EmotionService();
