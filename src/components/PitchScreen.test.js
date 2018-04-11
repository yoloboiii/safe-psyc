// @flow

import { PitchScreen } from '~/src/components/PitchScreen.js';
import { StandardButton } from '~/src/components/lib/Buttons.js';
import { render } from '~/tests/render-utils.js';
import { mockNavigation } from '~/tests/navigation-utils.js';
import { getChildrenAndParent } from '~/tests/component-tree-utils.js';

const defaultProps = {
    navigation: mockNavigation(),
};

it('contains a skip button that navigates to the login screen', () => {
    const navigation = mockNavigation();
    const component = render(PitchScreen, { navigation: navigation }, defaultProps);

    clickSkipButton(component);

    expect(navigation.dispatch).toHaveResetTo('Login');
});

function clickSkipButton(component) {
    const skipButton = getChildrenAndParent(component).filter(
        b => b.props && b.props.testID === 'skipButton'
    )[0];
    expect(skipButton).toBeDefined();

    skipButton.props.onPress();
}

it('persists the fact that the pitch was skipped', () => {
    const storageMock = {
        setItem: jest.fn().mockReturnValue(Promise.resolve()),
    };

    const navigation = setupMockStorage(storageMock);
    const component = render(PitchScreen, { navigation: navigation }, defaultProps);

    clickSkipButton(component);

    expect(storageMock.setItem).toHaveBeenCalledWith('hasSeenThePitch', 'true');
});

it('redirects even if the storing fails', () => {
    const storageMock = {
        setItem: jest.fn().mockReturnValue(Promise.reject(new Error('foo'))),
    };

    const navigation = setupMockStorage(storageMock);
    const component = render(PitchScreen, { navigation: navigation }, defaultProps);

    clickSkipButton(component);

    expect(navigation.dispatch).toHaveBeenCalled();
});

function setupMockStorage(mock) {
    return Object.assign({}, mockNavigation(), {
        state: {
            params: {
                storage: mock,
            },
        },
    });
}
