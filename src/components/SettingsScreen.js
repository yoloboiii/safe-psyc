// @flow

import React from 'react';
import { View } from 'react-native';
import { StandardText } from './Texts';
import { StandardButton } from './Buttons.js';
import { VerticalSpace } from './VerticalSpace.js';
import { Credits } from './Credits.js';
import { constants } from '../styles/constants.js';
import { userBackendFacade } from '../services/user-backend.js';
import { onUserLoggedOut } from '../navigation-actions.js';

import type { Navigation } from '../navigation-actions.js';

type Props = {
    navigation: Navigation<{}>,
};
export class SettingsScreen extends React.Component<Props, {}> {
    static navigationOptions = {
        title: 'SETTINGS',
    };

    render() {
        const user = userBackendFacade.getLoggedInUser();
        const email = user ? user.email : undefined;

        return (
            <View
                style={{
                    ...constants.padflex,
                    ...{ justifyContent: 'space-between' },
                }}
            >
                <View>
                    <StandardText>Hi {email}</StandardText>
                    <VerticalSpace />
                    <StandardButton
                        onPress={() =>
                            userBackendFacade
                                .logOut()
                                .then(() =>
                                    onUserLoggedOut(this.props.navigation)
                                )
                        }
                        title={'Log out'}
                    />
                </View>
                <Credits />
            </View>
        );
    }
}
