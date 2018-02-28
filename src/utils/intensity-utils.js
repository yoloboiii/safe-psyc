// @flow

export function intensityToGroup(intensity: number) {
    const quotient = Math.floor(intensity / 2);
    const remainder = intensity % 2;

    return Math.min(5, quotient + remainder);
}
