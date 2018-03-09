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

// Stolen from https://gist.github.com/guilhermepontes/17ae0cc71fa2b13ea8c20c94c5c35dc4
export function copyAndShuffle<T>(arr: Array<T>): Array<T> {
  return arr
    .slice()
    .map(a => [Math.random(), a])
    .sort((a, b) => a[0] - b[0])
    .map(a => a[1]);
}

export function randomElement<T>(from: Array<T>, not: ?Array<T>): T {
    return not
        ? randomElementByShuffle(from, not)
        : simpleRandomElement(from)
}
function randomElementByShuffle<T>(from: Array<T>, not: Array<T>): T {
    const shuffledCopy = copyAndShuffle(from);
    do {
        const candidate = shuffledCopy.pop();
        if (!not.includes(candidate)) {
            return candidate;
        }

    } while (shuffledCopy.length > 0);

    throw new Error("Unable to get a random element from the array that was not in the ignore list");
}
function simpleRandomElement<T>(from: Array<T>): T {
    const rnd = Math.floor(Math.random() * from.length);
    return from[rnd];
}
