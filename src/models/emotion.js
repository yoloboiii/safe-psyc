// @flow

export class Emotion {
    name: string;
    image: ?string;

    constructor(name: string, image: ?string) {
        this.name = name;
        this.image = image;
    }
}

export class EmotionBuilder {
    name: string;
    image: ?string;

    withName(name: string): EmotionBuilder {
        this.name = name;
        return this;
    }

    withImage(image: string): EmotionBuilder {
        this.image = image;
        return this;
    }

    build(): Emotion {
        return new Emotion(this.name, this.image);
    }
}
