// @flow

import React from 'react';
import { TouchableHighlight, Text } from 'react-native';
import { constants } from '../styles/constants.js';

const containerStyle = {
    backgroundColor: constants.hilightColor2,
    margin: constants.space,
    padding: 3 * constants.space,
    borderRadius: 10,
    elevation: 2,
};
const textStyle = {
    ...constants.largeText,
    color: 'white',
    alignSelf: 'center',
};

type Props = {
    title: any,
};
export function HeroButton(props: Props) {
    const { title, ...restProps } = props;
    const content = typeof title === 'string'
        ? <Text style={ textStyle }>{title.toUpperCase()}</Text>
        : title

    return <TouchableHighlight
        style={ containerStyle }
        {...restProps} >
        { content }
    </TouchableHighlight>
}
