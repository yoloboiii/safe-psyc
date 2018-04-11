// @flow

import { capitalize, formatParagraph } from '~/src/utils/text-utils.js';

describe('capitalize', () => {
    it('uppercases the first char if it is lowercase', () => {
        expect(capitalize('hello world')).toEqual('Hello world');
    });

    it('keeps the char as uppercase if it is uppercase', () => {
        expect(capitalize('Hello world')).toEqual('Hello world');
    });
});

describe('formatParagraph', () => {
    it('capitalizes only first word in a list if sentences', () => {
        expect(formatParagraph('hello world. and the other thing. also this')).toEqual(
            'Hello world. And the other thing. Also this.'
        );
    });

    it("Adds a dot if one isn't there - one sentence", () => {
        expect(formatParagraph('Hello')).toEqual('Hello.');
    });

    it('Does not add a dot if one is there - one sentence', () => {
        expect(formatParagraph('Hello.')).toEqual('Hello.');
    });

    it('Adds a dot to the last sentence', () => {
        expect(formatParagraph('Hello. World')).toEqual('Hello. World.');
    });
});
