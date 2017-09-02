import React from 'react';
import { View, FlatList, Button } from 'react-native';
import { VerticalSpace } from './VerticalSpace.js';

type Props = {
    buttons: Array<{
        text: string,
    }>,
};

export function ButtonList(props: Props) {
    return <FlatList
        data={props.buttons}
        renderItem={(button) => {
            return <View>
                <Button
                title={button.item.text}
                onPress={ ()=>{} }/>
                <VerticalSpace />
            </View>
        }}
        itemSeparatorComponent={<VerticalSpace />}

        />
}
