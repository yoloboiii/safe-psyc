// @flow

export type Coordinates = {|
    intensity: number,
    polar: number,
|};
export class Emotion {
    name: string;
    description: string;
    image: ?string;
    coordinates: ?Coordinates;

    constructor(name: string, description: string, image: ?string, coordinates: ?Coordinates) {
        this.name = name;
        this.description = description;
        this.image = image;
        this.coordinates = coordinates;
    }

    intensity(): ?number {
        return this.coordinates ? this.coordinates.intensity : null;
    }

    polarity(): ?number {
        return this.coordinates ? this.coordinates.polar : null;
    }
}

export class EmotionBuilder {
    name: string;
    description: string;
    image: ?string;
    coordinates: ?Coordinates;

    withName(name: string): EmotionBuilder {
        this.name = name;
        return this;
    }

    withDescription(description: string): EmotionBuilder {
        this.description = description;
        return this;
    }

    withImage(image: string): EmotionBuilder {
        this.image = image;
        return this;
    }

    withCoordinates(coordinates: Coordinates): EmotionBuilder {
        this.coordinates = coordinates;
        return this;
    }

    build(): Emotion {
        return new Emotion(this.name, this.description, this.image, this.coordinates);
    }
}
