// @flow

import React from 'react';
import { View, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { StandardText } from './Texts.js';
import { VerticalSpace } from './VerticalSpace.js';
import { CurrentFeeling } from './CurrentFeeling.js';
import { emotionService } from '../services/emotion-service.js';
import { backendFacade } from '../services/backend.js';
import { resetToHome } from '../navigation-actions.js';

import type { Navigation } from '../navigation-actions.js';

type Props = {
    navigation: Navigation<{
        skippable: boolean,
    }>,
}
type State = { };
export class CurrentFeelingScreen extends React.Component<Props, State> {
    static navigationOptions = {
        title: 'How are you feeling right now?',
    };

    render() {
        const skippable = this.props.navigation.state && this.props.navigation.state.params
            ? !!this.props.navigation.state.params.skippable
            : false;

        const onSkip = skippable
            ? () => resetToHome(this.props.navigation)
            : undefined;

        return <CurrentFeeling
            onAnswered={ () => resetToHome(this.props.navigation) }
            onSkip={ onSkip }
            emotionWords={ emotionService.getEmotionPool().map(e => e.name).sort() }
            backendFacade={ backendFacade } />
    }
}
