// @flow

import React from 'react';
import { Text } from 'react-native';
import { constants } from '../styles/constants.js';

const standardDefaultStyle = constants.normalText;
const largeDefaultStyle = constants.largeText;

type Props = {
    customStyle?: Object,
};
export function StandardText(props: Props) {
    const { customStyle, ...restProps } = props;

    const style = customStyle
        ? Object.assign({}, standardDefaultStyle, customStyle)
        : standardDefaultStyle;

    return <Text style={ style } { ...restProps } />
}

export function LargeText(props: Props) {
    const { style, ...restProps } = props;

    const actualStyle = Object.assign({}, largeDefaultStyle, style);
    return <Text style={ actualStyle } { ...restProps } />
}
