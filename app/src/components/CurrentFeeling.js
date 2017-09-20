// @flow

import React from 'react';
import { View } from 'react-native';
import { StandardText } from './StandardText.js';
import { ExpandedSearchableList } from './ExpandedSearchableList.js';

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
    return <View>
        <StandardText>Please choose the word that best describes how you are feeling right now</StandardText>

        <ExpandedSearchableList
            data={ listData }
            // $FlowFixMe
            renderRow={ (d) => _renderEmotionRow(d.item.item) }
        />
    </View>

    function _chooseEmotionWord(emotion) {
        console.log('Chose', emotion);
        props.backendFacade.registerCurrentEmotion(emotion);
    }

    function _renderEmotionRow(emotion) {

        return <StandardText
            onPress={ _chooseEmotionWord }>
            { emotion }
        </StandardText>
    }
}

