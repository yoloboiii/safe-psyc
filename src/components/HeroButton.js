// @flow

import React from 'react';
import { TouchableHighlight, Text } from 'react-native';
import { constants } from '../styles/constants.js';

const containerStyle = {
    backgroundColor: constants.hilightColor2,
    margin: constants.space,
    padding: 3 * constants.space,
    borderRadius: 10,
};
const textStyle = {
    ...constants.largeText,
    alignSelf: 'center',
};

type Props = {
    title: string,
};
export function HeroButton(props: Props) {
    const { title, ...restProps } = props;

    return <TouchableHighlight
        style={ containerStyle }
        {...restProps} >
        <Text style={ textStyle }>{title.toUpperCase()}</Text>
    </TouchableHighlight>
}
