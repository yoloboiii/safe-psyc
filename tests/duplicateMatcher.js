// @flow

expect.extend({
    toContainDuplicates: (received) => {
        const elementsAndPositions = new Map();
        for (const elementIndex in received) {
            const element = received[elementIndex];
            const flow_elementIndex: number = (elementIndex: any);

            if (!elementsAndPositions.has(element)) {
                elementsAndPositions.set(element, []);
            }

            // $FlowFixMe
            elementsAndPositions.get(element).push(flow_elementIndex);
        }

        const duplicateElements = [];
        elementsAndPositions.forEach((positions, element) => {
            if (positions.length > 1) {
                duplicateElements.push({
                    element, positions
                });
            }
        });

        return {
            pass: duplicateElements.length > 0,
            message: () => '[' + received + '] contained the following duplicates:\n  ' + formatDuplicates(duplicateElements).join('\n  '),
        };
    },
});

function formatDuplicates(duplicates: Array<{element: string, positions: Array<number>}>): Array<string> {
    return duplicates.map(dup => {
        return dup.element + ' at indices [' + dup.positions.join(', ') + ']';
    });
}
