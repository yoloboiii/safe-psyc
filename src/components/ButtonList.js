// @flow

import React from 'react';
import { View, FlatList, Button } from 'react-native';
import { VerticalSpace } from './VerticalSpace.js';

type Apa = {
    text: string,
};
type Props = {
    buttons: Array<Apa>,
    onPress: (Apa) => void,
};

export function ButtonList(props: Props) {
    return <FlatList
        data={props.buttons}
        renderItem={(button) => {
            return <View>
                <Button
                title={button.item.text}
                onPress={ () => props.onPress(button.item) }/>
                <VerticalSpace />
            </View>
        }}
        />
}
