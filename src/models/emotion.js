// @flow

export class Emotion {
    name: string;
    image: ?string;
    intensity: ?number;

    constructor(name: string, image: ?string, intensity: ?number) {
        this.name = name;
        this.image = image;
        this.intensity = intensity;
    }
}

export class EmotionBuilder {
    name: string;
    image: ?string;
    intensity: ?number;

    withName(name: string): EmotionBuilder {
        this.name = name;
        return this;
    }

    withImage(image: string): EmotionBuilder {
        this.image = image;
        return this;
    }

    withIntensity(intensity: number): EmotionBuilder {
        this.intensity = intensity;
        return this;
    }

    build(): Emotion {
        return new Emotion(this.name, this.image, this.intensity);
    }
}
