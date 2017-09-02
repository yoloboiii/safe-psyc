import React from 'react';
import { FlatList, Button } from 'react-native';

type Props = {
    buttons: Array<{
        text: string,
    }>,
};

export function ButtonList(props: Props) {
    return <FlatList
        data={props.buttons}
        renderItem={(button) => {
            return <Button
                title={button.item.text}
                onPress={ ()=>{} }/>
        }} />
}
