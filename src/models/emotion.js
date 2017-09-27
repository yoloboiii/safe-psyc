// @flow

export class Emotion {
    id: number;
    name: string;
    image: ?string;

    constructor(id: number, name: string, image: ?string) {
        this.id = id;
        this.name = name;
        this.image = image;
    }
}

export class EmotionBuilder {
    id: number;
    name: string;
    image: ?string;

    withId(id: number): EmotionBuilder {
        this.id = id;
        return this;
    }

    withName(name: string): EmotionBuilder {
        this.name = name;
        return this;
    }

    withImage(image: string): EmotionBuilder {
        this.image = image;
        return this;
    }

    build(): Emotion {
        return new Emotion(this.id, this.name, this.image);
    }
}
