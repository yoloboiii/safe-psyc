// @flow

import React from 'react';
import { View, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { StandardText } from './StandardText.js';
import { VerticalSpace } from './VerticalSpace.js';
import { CurrentFeeling } from './CurrentFeeling.js';
// $FlowFixMe
import { NavigationActions } from 'react-navigation';
import { backendFacade } from '../services/backend.js';
import { resetToHome } from '../navigation-actions.js';

import type { Navigation } from '../navigation-actions.js';

type Props = {
    navigation: Navigation<{
        skippable: boolean,
    }>,
}
type State = {
    finishedLoading: boolean,
    emotionWords: Array<string>,
};
export class CurrentFeelingScreen extends React.Component<Props, State> {
    static navigationOptions = {
        title: 'How are you feeling right now?',
    };

    constructor() {
        super();
        this.state = {
            finishedLoading: false,
            emotionWords: [],
        };
    }

    componentDidMount() {
        backendFacade.getEmotionWords()
            .then( words => {
                this.setState({
                    finishedLoading: true,
                    emotionWords: words,
                });
            });
    }

    render() {
       if (!this.state.finishedLoading) {
            return <View>
                <StandardText>Loading emotion words</StandardText>
                <ActivityIndicator />
            </View>

        } else {
            const skippable = this.props.navigation.state && this.props.navigation.state.params
                ? !!this.props.navigation.state.params.skippable
                : false;

            console.log('nav', skippable);
            const onSkip = skippable
                ? () => resetToHome(this.props.navigation)
                : undefined;

            return <CurrentFeeling
                onAnswered={ () => resetToHome(this.props.navigation) }
                onSkip={ onSkip }
                emotionWords={ this.state.emotionWords }
                backendFacade={ backendFacade } />
        }
    }
}
