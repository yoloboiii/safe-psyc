// @flow

import React from 'react';
import { Button } from 'react-native';
import { constants } from '../styles/constants.js';

const defaultColor = constants.primaryColor;
const defaultStyle = { };

type Props = {
    customStyle?: Object,
    customColor?: string,
};
export function StandardButton(props: Props) {
    const { customStyle, customColor, ...restProps } = props;

    const style = customStyle
        ? Object.assign({}, defaultStyle, customStyle)
        : defaultStyle;

    const color = customColor || defaultColor;

    return <Button
                style={ style }
                color={ color }
                {...restProps} />
}
