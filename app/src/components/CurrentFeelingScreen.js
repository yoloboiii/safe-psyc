// @flow

import React from 'react';
import { View, TextInput, FlatList } from 'react-native';
import { Svg, Circle, Rect } from 'react-native-svg';
import { StandardText } from './StandardText.js';
import { VerticalSpace } from './VerticalSpace.js';

import { backendFacade } from '../services/backend.js';

export class CurrentFeelingScreen extends React.Component<{}, {}> {
    static navigationOptions = {
        title: 'How are you feeling right now?',
    };

    _chooseEmotionWord(word) {
        console.log('Chose', emotion);
        backendFacade.registerCurrentEmotion(emotion);
    }

    render() {
        return <View>
            <StandardText>Please choose the word that best describes how you are feeling right now</StandardText>
            <ExpandedSearchableList
                data={[{ item: 'a', key: 'a' }, { item: 'b', key: 'b' }]}
                renderRow={ (d) => this._renderEmotionRow(d.item.item) }
            />
        </View>
    }

    _renderEmotionRow(emotion) {

        return <StandardText
            onPress={ this._chooseEmotionWord.bind(this) }>
            { emotion }
        </StandardText>
    }
}


type ESLProps<T> = {
    data: Array<{ item: T, key: string }>,
    renderRow: (T) => React.Component<*,*>
};
type ESLState<T> = {
    searchString: string,
    data: Array<{ item: T, key: string }>,
};
class ExpandedSearchableList<T> extends React.Component<ESLProps<T>, ESLState<T>> {

    constructor(props: ESLProps) {
        super(props);
        this.state = {
            searchString: '',
            data: props.data,
        };
    }

    _onSearch(text) {
        const data = this.props.data.filter(d => d.indexOf(text) > -1);
        this.setState({
            searchString: text,
            data: data,
        });
    }

    render() {
        const { renderRow } = this.props;
        const { searchString, data } = this.state;

        return <View>
            <TextInput
                placeholder={ 'search...' }
                onChangeText={ this._onSearch.bind(this) }
                value={ searchString } />

            <VerticalSpace />

            <FlatList
                data={ data }
                renderItem={ renderRow } />
        </View>
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
