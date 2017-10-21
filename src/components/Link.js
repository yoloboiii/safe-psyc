// @flow

import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { StandardText } from './Texts.js';

type Props = {
    prefix?: string,
    linkText: string,
    onLinkPress: () => void,
    postfix?: string,
};

const containerStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
};
export function Link(props: Props) {
    const { prefix, linkText, onLinkPress, postfix } = props;


    const prefixComponent = prefix
        ? <StandardText>{ prefix }</StandardText>
        : null;

    const touchable = <TouchableOpacity onPress={ onLinkPress }>
        <StandardText style={{ textDecorationLine: 'underline' }}>
            { linkText }
        </StandardText>
    </TouchableOpacity>

    const postfixComponent = postfix
        ? <StandardText>{ postfix }</StandardText>
        : null;


    return <View style={ containerStyle }>
        { prefixComponent }
        { touchable }
        { postfixComponent }
    </View>
}
