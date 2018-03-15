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
};

const spaceWidth = 5;
const vertSpace = 5;

const containerStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
};
const textStyle = {
    paddingVertical: vertSpace,
    ...constants.largeText,
};
const pillStyle = {
    ...constants.largeText,
    backgroundColor: constants.primaryColor,
    color: constants.notReallyWhite,

    borderRadius: constants.mediumRadius,

    paddingVertical: vertSpace,
    paddingHorizontal: 2 * vertSpace,
};
export function Link(props: Props) {
    const { prefix, linkText, onLinkPress, postfix } = props;

    return (
        <View style={containerStyle}>
            <Prefix text={prefix} />
            <Pill text={linkText} onPress={onLinkPress} />
            <Postfix text={postfix} />
        </View>
    );
}

function Prefix(props) {
    const { text } = props;
    if (text) {
        return <StandardText style={[textStyle, { marginRight: spaceWidth }]}>{text}</StandardText>;
    } else {
        return null;
    }
}

function Postfix(props) {
    const { text } = props;
    if (text) {
        return <StandardText style={[textStyle, { marginLeft: spaceWidth }]}>{text}</StandardText>;
    } else {
        return null;
    }
}

function Pill(props) {
    const { text, onPress } = props;
    return <TouchableOpacity onPress={onPress}>
        <StandardText style={pillStyle}>
            { text }
        </StandardText>
    </TouchableOpacity>
}

