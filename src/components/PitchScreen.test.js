// @flow

import { PitchScreen } from './PitchScreen.js';
import { StandardButton } from './Buttons.js';
import { render } from '../../tests/render-utils.js';
import { findChildren } from '../../tests/component-tree-utils.js';

const defaultProps = {
    navigation: {
        dispatch: jest.fn(),
    },
};

it('contains a skip button that navigates to the login screen', () => {
    const dispatchMock = jest.fn();
    const navigation = {
        dispatch: dispatchMock,
    };
    const component = render(PitchScreen, { navigation: navigation }, defaultProps);

    clickSkipButton(component);

    expect(dispatchMock).toHaveResetTo('Login');
});

function clickSkipButton(component) {
    const skipButton = findChildren(component, StandardButton)
        .filter(b => b.props.title.toLowerCase() === 'skip')[0];
    expect(skipButton).toBeDefined();

    skipButton.props.onPress();
}

it('persists the fact that the pitch was skipped', () => {
    const storageMock = {
        setItem: jest.fn()
            .mockReturnValue(Promise.resolve()),
    };

    const navigation = setupMockStorage(storageMock);
    const component = render(PitchScreen, { navigation: navigation }, defaultProps);

    clickSkipButton(component);

    expect(storageMock.setItem).toHaveBeenCalledWith('hasSeenThePitch', 'true');
});

it('redirects even if the storing fails', () => {
    const storageMock = {
        setItem: jest.fn()
            .mockReturnValue(Promise.reject(new Error('foo'))),
    };

    const navigation = setupMockStorage(storageMock);
    navigation.dispatch = jest.fn();
    const component = render(PitchScreen, { navigation: navigation }, defaultProps);

    clickSkipButton(component);

    expect(navigation.dispatch).toHaveBeenCalled();
});

function setupMockStorage(mock) {
    return Object.assign({}, defaultProps.navigation, {
        state: {
            params: {
                storage: mock,
            },
        },
    });
}
