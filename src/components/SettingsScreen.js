// @flow

import React from 'react';
import { View } from 'react-native';
import { StandardText } from '~/src/components/lib/Texts';
import { StandardButton } from '~/src/components/lib/Buttons.js';
import { VerticalSpace } from '~/src/components/lib/VerticalSpace.js';
import { constants } from '~/src/styles/constants.js';
import { userBackendFacade } from '~/src/services/user-backend.js';
import { onUserLoggedOut, navigateToRegister } from '~/src/navigation-actions.js';


type Props = {
};
export class SettingsScreen extends React.Component<Props, {}> {
    static navigationOptions = {
        title: 'SETTINGS',
    };

    render() {
        const user = userBackendFacade.getLoggedInUser();
        if (!user) {
            return <StandardText>Cannot show settings when there's no user logged in</StandardText>
        }

        return user.isAnonymous
            ? <AnonymousSettings user={user} />
            : <NamedSettings user={user} />

    }
}

function AnonymousSettings(props) {
    const { user } = props;
    return <View style={constants.padflex}>
        <StandardText>
            { /* hehe, this is the worst text I've ever written */ }
            If you want to your progress to be kept across app installs you will need to register
        </StandardText>

        <VerticalSpace />

        <StandardButton
            title={'Register'}
            onPress={navigateToRegister}
        />

        <VerticalSpace />
        { __DEV__ && <LogoutButton title='Log out - all data will be lost'/> }
    </View>
}

function LogoutButton(props) {
    const { title } = props;
    return <StandardButton
            onPress={() =>
                userBackendFacade
                    .logOut()
                    .then(() => onUserLoggedOut())
            }
            title={title}
        />
}

function NamedSettings(props) {
    const { user } = props;

    return <View>
        <StandardText>Hi { user.email }</StandardText>
        <VerticalSpace />
        <LogoutButton title='Log out'/>
    </View>

}
