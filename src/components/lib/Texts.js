// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import { constants } from '~/src/styles/constants.js';

const standardDefaultStyle = constants.normalText;

type Props = {
    style?: ?Object | Array<?Object>,
};
type Context = {
    textStyle?: Object,
};
export function StandardText(props: Props, context: Context) {
    const { style, ...restProps } = props;

    return <Text style={[standardDefaultStyle, context.textStyle, style]} {...restProps} />;
}
StandardText.contextTypes = {
    textStyle: PropTypes.object,
};

/////////////////////////////////////////
/////////////////////////////////////////
const largeDefaultStyle = constants.largeText;
export function LargeText(props: Props, context: Context) {
    const { style, ...restProps } = props;

    return <Text style={[largeDefaultStyle, context.textStyle, style]} {...restProps} />;
}
LargeText.contextTypes = {
    textStyle: PropTypes.object,
};

/////////////////////////////////////////
/////////////////////////////////////////
const titleDefaultStyle = {
    fontSize: constants.space(7),
    flex: 0,
};
export function Title(props: Props, context: Context) {
    const { style, ...restProps } = props;

    return <Text style={[titleDefaultStyle, context.textStyle, style]} {...restProps} />;
}
Title.contextTypes = {
    textStyle: PropTypes.object,
};

