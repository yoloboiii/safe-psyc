// @flow

import { setNavigation } from '../src/navigation-actions.js';
import type { Navigation } from '../src/navigation-actions.js';

export function mockNavigation(): Navigation<*> {
    const navigation = {
        dispatch: jest.fn(),
        addListener: jest.fn(),
        navigate: jest.fn(),
    };

    setNavigation(navigation);
    return navigation;
}

