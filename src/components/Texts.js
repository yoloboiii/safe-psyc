// @flow

import React from 'react';
import { Text } from 'react-native';
import { constants } from '../styles/constants.js';

const standardDefaultStyle = constants.normalText;
const largeDefaultStyle = constants.largeText;

type Props = {
    style?: Object,
};
export function StandardText(props: Props) {
    const { style, ...restProps } = props;

    const actualStyle = Object.assign({}, largeDefaultStyle, style);

    return <Text style={actualStyle} {...restProps} />;
}

export function LargeText(props: Props) {
    const { style, ...restProps } = props;

    const actualStyle = Object.assign({}, largeDefaultStyle, style);
    return <Text style={actualStyle} {...restProps} />;
}
