// @flow

import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { StandardText } from './Texts.js';
import { constants } from '../styles/constants.js';

type Props = {
    prefix?: string,
    linkText: string,
    onLinkPress: () => void,
    postfix?: string,
    underlineColor?: string,
};

const containerStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
};
const defaultTouchableStyle = {
    borderBottomWidth: 1,
    borderBottomColor: constants.lightTextColor,
};
export function Link(props: Props) {
    const { prefix, linkText, onLinkPress, postfix, underlineColor } = props;


    const prefixComponent = prefix
        ? <StandardText>{ prefix }</StandardText>
        : null;

    const touchableStyle = underlineColor
        ? Object.assign({}, defaultTouchableStyle, { borderBottomColor: underlineColor })
        : defaultTouchableStyle;

    const touchable = <TouchableOpacity onPress={ onLinkPress } style={ touchableStyle }>
        <StandardText>
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
