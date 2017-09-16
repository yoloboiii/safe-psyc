// @flow

import React from 'react';
import { Text } from 'react-native';
import { constants } from '../styles/constants.js';

const defaultStyle = constants.normalText;

type Props = {
    customStyle?: Object,
};
export function StandardText(props: Props) {
    const { customStyle, ...restProps } = props;

    const style = customStyle
        ? Object.assign({}, defaultStyle, customStyle)
        : defaultStyle;

    return <Text style={ style } { ...restProps } />
}
