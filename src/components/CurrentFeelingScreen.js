// @flow

import React from 'react';
import { View, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { StandardText } from './StandardText.js';
import { VerticalSpace } from './VerticalSpace.js';
import { CurrentFeeling } from './CurrentFeeling.js';
// $FlowFixMe
import { NavigationActions } from 'react-navigation';
import { backendFacade } from '../services/backend.js';

import type { Navigation } from '../navigation-actions.js';

type Props = {
    navigation: Navigation<{}>,
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
            return <CurrentFeeling
                onAnswered={ () => {
                    this.props.navigation.dispatch(NavigationActions.reset({
                        index: 0,
                        actions: [
                            NavigationActions.navigate({ routeName: 'Home' }),
                        ],
                    }));
                }}
                emotionWords={ this.state.emotionWords }
                backendFacade={ backendFacade } />
        }
    }
}
