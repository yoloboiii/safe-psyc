// @flow

import { renderShallow } from '../../tests/render-utils.js';
import { SessionScreen } from './SessionScreen.js';
import { Session } from './Session.js';
import { onSessionFinished } from '../navigation-actions.js';

it('calls navition-actions.onSessionFinished when the session is done', () => {
    const navigation = {
        navigation: {
            state: {
                params: { },
            },
        },
    };
    const component = renderShallow(SessionScreen, navigation);
    expect(component).toHaveChildWithProps(Session, {
        onSessionFinished: onSessionFinished,
    });
});
