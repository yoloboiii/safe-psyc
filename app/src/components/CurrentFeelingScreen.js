// @flow

import React from 'react';
import { View, TextInput, FlatList } from 'react-native';
import { StandardText } from './StandardText.js';
import { VerticalSpace } from './VerticalSpace.js';
import { CurrentFeeling } from './CurrentFeeling.js';

// $FlowFixMe
import { Svg, Circle, Rect } from 'react-native-svg';

import { backendFacade } from '../services/backend.js';

export class CurrentFeelingScreen extends React.Component<{}, {}> {
    static navigationOptions = {
        title: 'How are you feeling right now?',
    };

    render() {
        return <CurrentFeeling
            emotionWords={ ['a', 'b'] }
            backendFacade={ backendFacade } />
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
