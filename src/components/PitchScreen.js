// @flow

import React from 'react';
import { View, AsyncStorage } from 'react-native';
import Swiper from 'react-native-swiper';
import { StandardText } from './Texts.js';
import { StandardButton } from './Buttons.js';
import { resetToLogin } from '../navigation-actions.js';
import { paramsOr } from '../navigation-actions.js';
import { log } from '../services/logger.js';
import { constants } from '../styles/constants.js';

import type { Navigation } from '../navigation-actions.js';

type Props = {
    navigation: Navigation<{
        storage?: AsyncStorage,
    }>,
};
type State = {
}
export class PitchScreen extends React.Component<Props, State> {

    static navigationOptions = {
        header: null,
    };

    _skip() {
        const storage = paramsOr(this.props.navigation, { storage: AsyncStorage }).storage;
        // $FlowFixMe
        storage.setItem('hasSeenThePitch', 'true')
            .then( () => {
                log.debug('Successfully persisted to skip the pitch');
            })
            .catch( e => {
                log.error('Unable to persist that the pitch is to be skipped: %s', e);
            });

        resetToLogin(this.props.navigation);
    }

    render() {
        return <View style={{
            flex: 1,
            padding: constants.space,
            backgroundColor: constants.primaryColor,
        }}>
            <Swiper
                style={ constants.flex1 }
                dotColor={ constants.defaultTextColor }
                activeDotColor={ constants.hilightColor2 }
                showsButtons={true}
                nextButton={ <StandardText>{'>'}</StandardText> }
                prevButton={ <StandardText>{'<'}</StandardText> }
                >
                <StandardText>hellu</StandardText>
                <StandardText>helluy</StandardText>
                <StandardText>helluuuu</StandardText>
            </Swiper>

            <StandardButton
                customColor={ constants.hilightColor2 }
                title={ 'Skip' }
                onPress={ this._skip.bind(this) }
                />
        </View>
    }
}
