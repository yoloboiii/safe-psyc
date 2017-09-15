// @flow

import React from 'react';
import { Button } from 'react-native';
import { constants } from '../styles/constants.js';

const defaultColor = constants.primaryColor;
const defaultStyle = { };

export function StandardButton(props) {
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
