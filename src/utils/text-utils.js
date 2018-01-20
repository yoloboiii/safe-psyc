// @flow

export function capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.substr(1);
}

export function formatParagraph(s: string): string {
    const sentences = s.split('.');

    return sentences
        .filter(sentence => sentence.trim().length > 0)
        .map(sentence => capitalize(sentence.trim()))
        .map(sentence => {
            const endsWithDot = sentence.endsWith('.');
            if (endsWithDot) {
                return sentence;
            } else {
                return sentence + '.';
            }
        })
        .join(' ');
}
