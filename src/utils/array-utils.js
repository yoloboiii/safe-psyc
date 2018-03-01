// @flow

// Stolen from https://stackoverflow.com/a/3954451
export function removeFrom<T>(array: Array<T>, item: T): boolean {
    const index = array.indexOf(item);

    if (index === -1) {
        return false;
    } else {
        array.splice(index, 1);
        return true;
    }
}
