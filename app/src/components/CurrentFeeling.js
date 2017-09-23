// @flow

import React from 'react';
import { View, Alert } from 'react-native';
import { StandardText } from './StandardText.js';
import { StandardButton } from './Buttons.js';
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

    return <View style={ constants.padflex } >
        <StandardText>Please choose the word that best describes how you are feeling right now</StandardText>
        <VerticalSpace />

        <ExpandedSearchableList
            data={ listData }
            // $FlowFixMe
            renderRow={ (d) => _renderEmotionRow(d.item.item) }
        />
    </View>

    function _chooseEmotionWord(emotion) {
        console.log('Chose', emotion);
        props.backendFacade.registerCurrentEmotion(emotion)
            .catch( e => {
                Alert.alert('Save failure', e.message);
            });
    }

    function _renderEmotionRow(emotion) {

        return <View style={ constants.padding }>
            <StandardButton
                onPress={ () => _chooseEmotionWord(emotion) }
                title={ emotion } />
        </View>
    }
}

