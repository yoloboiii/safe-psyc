// @flow

import React from 'react';
import { StandardText } from './Texts.js';
import { constants } from '../../styles/constants.js';

type Props = {
    prefix?: string,
    linkText: string,
    onLinkPress: () => void,
    postfix?: string,
};

const vertSpace = 5;

const containerStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',

    paddingVertical: vertSpace,
};
const pillStyle = {
    backgroundColor: constants.primaryColor,
    color: constants.notReallyWhite,

    borderRadius: constants.mediumRadius,

    paddingVertical: vertSpace,
    paddingHorizontal: 2 * vertSpace,

};
export function Link(props: Props) {
    const { prefix, linkText, onLinkPress, postfix } = props;

    return (
        <StandardText style={containerStyle}>
            {prefix}
            <Pill text={linkText} onPress={onLinkPress} />
            {postfix}
        </StandardText>
    );
}

function Pill(props) {
    const { text, onPress } = props;
    return <StandardText style={pillStyle} onPress={onPress} >
        {text}
    </StandardText>
}

