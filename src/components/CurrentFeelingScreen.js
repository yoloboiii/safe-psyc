// @flow

import React from 'react';
import { View, TextInput, FlatList } from 'react-native';
import { StandardText } from './lib/Texts.js';
import { VerticalSpace } from './lib/VerticalSpace.js';
import { PhotographicAffectMeter } from './PhotographicAffectMeter.js';
import { emotionService } from '../services/emotion-service.js';
import { currentEmotionBackendFacade } from '../services/current-emotion-backend.js';
import { resetToHome } from '../navigation-actions.js';
import { log } from '../services/logger.js';

import type { Navigation } from '../navigation-actions.js';

type Props = {
    navigation: Navigation<{
        skippable: boolean,
    }>,
};
type State = {};
export class CurrentFeelingScreen extends React.Component<Props, State> {

    static navigationOptions = {
        title: 'How are you feeling?',
    };

    _skip() {
        log.event('CURRENT_EMOTION_SKIPPED');
        resetToHome();
    }

    render() {
        const skippable =
            this.props.navigation.state && this.props.navigation.state.params
                ? !!this.props.navigation.state.params.skippable
                : false;

        const onSkip = skippable ? () => this._skip() : undefined;

        return (
            <PhotographicAffectMeter
                onAnswered={() => resetToHome()}
                onSkip={onSkip}
                backendFacade={currentEmotionBackendFacade}
                emotionImages={require('../../SECRETS/pam/pam-images.json')}
            />
        );
    }
}
