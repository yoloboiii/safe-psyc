// @flow

import React from 'react';
import { View } from 'react-native';
import { StandardText } from './lib/Texts';
import { StandardButton } from './lib/Buttons.js';
import { VerticalSpace } from './lib/VerticalSpace.js';
import { constants } from '../styles/constants.js';
import { userBackendFacade } from '../services/user-backend.js';
import { onUserLoggedOut } from '../navigation-actions.js';


type Props = {
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
                                .then(() => onUserLoggedOut())
                        }
                        title={'Log out'}
                    />
                </View>
            </View>
        );
    }
}
