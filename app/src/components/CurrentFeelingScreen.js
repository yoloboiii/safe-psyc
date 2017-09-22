// @flow

import React from 'react';
import { View, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { StandardText } from './StandardText.js';
import { VerticalSpace } from './VerticalSpace.js';
import { CurrentFeeling } from './CurrentFeeling.js';

// $FlowFixMe
import { Svg, Circle, Rect } from 'react-native-svg';

import { backendFacade } from '../services/backend.js';

type State = {
    finishedLoading: boolean,
    emotionWords: Array<string>,
};
export class CurrentFeelingScreen extends React.Component<{}, State> {
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
                emotionWords={ this.state.emotionWords }
                backendFacade={ backendFacade } />
        }
    }
}

function ClickableSvgBody(props: {}) {

        return (
            <Svg
                height="100"
                width="100"
            >
                <Circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="blue"
                    strokeWidth="2.5"
                    fill="green"
                    onPress={ () => console.log('CLICKED CIRCLE') }
                />
                <Rect
                    x="15"
                    y="15"
                    width="70"
                    height="70"
                    stroke="red"
                    strokeWidth="2"
                    fill="yellow"
                    onPress={ () => console.log('CLICKED RECT') }
                />
            </Svg>
        );
}
