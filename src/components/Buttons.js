// @flow

import React from 'react';
import { TouchableHighlight, Text, Button } from 'react-native';
import { constants } from '../styles/constants.js';

const largeTextButtonStyle = {
    ...constants.largeText,
    color: constants.notReallyWhite,
    alignSelf: 'center',
};

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
type StandardButtonProps = {
    customColor?: string,
};
export function StandardButton(props: StandardButtonProps) {
    const { customColor, ...restProps } = props;

    const color = customColor || constants.primaryColor;

    return <Button
                color={ color }
                {...restProps} />
}

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
type LargeButtonProps = { title: string, style?: Object };
export function LargeButton(props: LargeButtonProps) {
    const { title, style, ...restProps } = props;

    const defaultStyle = {
        backgroundColor: constants.primaryColor,
        paddingVertical: 1 * constants.space,
        elevation: 2,
    };
    const concreteStyle = style
        ? Object.assign({}, defaultStyle, style)
        : defaultStyle;

    return <TouchableHighlight
        style={ concreteStyle }
        { ...restProps } >
        <Text style={ largeTextButtonStyle }>{ title }</Text>
    </TouchableHighlight>
}

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
const heroContainerStyle = {
    backgroundColor: constants.hilightColor2,
    padding: 3 * constants.space,
    borderRadius: 10,
    elevation: 2,
};
type HeroButtonProps = {
    title: any,
};
export function HeroButton(props: HeroButtonProps) {
    const { title, ...restProps } = props;
    const content = typeof title === 'string'
        ? <Text style={ largeTextButtonStyle }>{title.toUpperCase()}</Text>
        : title

    return <TouchableHighlight
        style={ heroContainerStyle }
        {...restProps} >
        { content }
    </TouchableHighlight>
}
