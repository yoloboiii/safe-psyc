// @flow

import React from 'react';
import { View } from 'react-native';
import { StandardText } from './StandardText.js';
import { StandardButton } from './Buttons.js';
import { VerticalSpace } from './VerticalSpace.js';
import { Credits } from './Credits.js';
import { constants } from '../styles/constants.js';
import { backendFacade } from '../services/backend.js';

import type { BackendFacade } from '../services/backend.js';

export class SettingsScreen extends React.Component<{}, {}> {
    static navigationOptions = {
        title: 'SETTINGS',
    };

    render() {
        const user = backendFacade.getLoggedInUser();
        const email = user
            ? user.email
            : undefined;

        return <View style={ {...constants.padflex, ...{justifyContent: 'space-between'}} }>
            <View>
                <StandardText>Hi { email }</StandardText>
                <VerticalSpace />
                <StandardButton
                    onPress={ () => backendFacade.logOut() }
                    title={ 'Log out' } />
            </View>
            <Credits />
        </View>
    }
}
