// @flow

import React from 'react';
import { View, ScrollView } from 'react-native';
import { StandardText } from './StandardText.js';
import { StandardButton } from './StandardButton.js';
import { ExpandedSearchableList } from './ExpandedSearchableList.js';
import { constants } from '../styles/constants.js';
import { VerticalSpace } from './VerticalSpace.js';

import type { BackendFacade } from '../services/backend.js';

type Props = {
    backendFacade: BackendFacade,
    emotionWords: Array<string>,
};
export function CurrentFeeling(props: Props) {
    const listData = props.emotionWords.map(word => {
        return {
            item: word,
            key: word,
        };
    });
    listData.push({
        item:'apa',
        key: 'apa',
    });
    listData.push({
        item:'a1pa',
        key: '1apa',
    });
    return <View style={{ flex: 1, padding: constants.space }} >
        <StandardText>Please choose the word that best describes how you are feeling right now</StandardText>
        <VerticalSpace />

        <ScrollView>
            <ExpandedSearchableList
                data={ listData }
                // $FlowFixMe
                renderRow={ (d) => _renderEmotionRow(d.item.item) }
            />
        </ScrollView>
    </View>

    function _chooseEmotionWord(emotion) {
        console.log('Chose', emotion);
        props.backendFacade.registerCurrentEmotion(emotion);
    }

    function _renderEmotionRow(emotion) {

        return <View style={{ padding: constants.space }}>
            <StandardButton
            onPress={ _chooseEmotionWord }
            title={ emotion } />
        </View>
    }
}

