// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import { constants } from '../styles/constants.js';

const standardDefaultStyle = constants.normalText;
const largeDefaultStyle = constants.largeText;

type Props = {
    style?: Object,
};
type Context = {
    textStyle?: Object,
};
export function StandardText(props: Props, context: Context) {
    const { style, ...restProps } = props;

    const actualStyle = Object.assign({}, standardDefaultStyle, context.textStyle, style);

    return <Text style={actualStyle} {...restProps} />;
}
StandardText.contextTypes = {
    textStyle: PropTypes.object,
};

export function LargeText(props: Props) {
    const { style, ...restProps } = props;

    const actualStyle = Object.assign({}, largeDefaultStyle, style);
    return <Text style={actualStyle} {...restProps} />;
}
