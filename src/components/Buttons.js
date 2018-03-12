// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Text, Button } from 'react-native';
import { constants } from '../styles/constants.js';

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
const standardButtonDefaultStyles = {
    enabled: {
        container: {
            borderRadius: constants.mediumRadius,
            backgroundColor: constants.primaryColor,
        },
        text: {
            ...constants.normalText,
            color: constants.notReallyWhite,
            textAlign: 'center',
            padding: constants.space,
        },
    },

    disabled: {
        container: {
            borderRadius: constants.mediumRadius,
            backgroundColor: constants.disabledColor,
        },
        text: {
            ...constants.normalText,
            color: constants.notReallyWhite,
            textAlign: 'center',
            padding: constants.space,
        },
    },
};
type StandardButtonProps = {
    onPress: () => *,
    disabled?: boolean,
    title: string,
    containerStyle?: Object,
    textStyle?: Object,
};
type StandardButtonContext = {
    buttonContainerStyle?: Object,
    buttonTextStyle?: Object,
};
export function StandardButton(props: StandardButtonProps, context: StandardButtonContext) {
    const { title, containerStyle, textStyle, disabled, ...restProps } = props;

    const defaultStyles = disabled
        ? standardButtonDefaultStyles.disabled
        : standardButtonDefaultStyles.enabled;

    return (
        <TouchableOpacity
            style={[
                defaultStyles.container,
                context.buttonContainerStyle,
                containerStyle,
            ]}
            disabled={disabled}
            {...restProps}
        >
            <Text style={[defaultStyles.text, context.buttonTextStyle, textStyle]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
}
StandardButton.contextTypes = {
    buttonContainerStyle: PropTypes.object,
    buttonTextStyle: PropTypes.object,
};

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
const secondaryButtonStyles = {
    container: {
    },
    text: {
        ...constants.normalText,
        textDecorationLine: 'underline',
        textAlign: 'center',
        padding: constants.space,
    },
};
type SecondaryButtonProps = {
    onPress: () => *,
    title: string,
    containerStyle?: Object,
    textStyle?: Object,
};
export function SecondaryButton(props: SecondaryButtonProps) {
    const { title, onPress, containerStyle, textStyle } = props;
    return <TouchableOpacity
        onPress={onPress}
        style={[ secondaryButtonStyles.container, containerStyle ]}
    >
        <Text style={[ secondaryButtonStyles.text, textStyle ]}>
            {title}
        </Text>
    </TouchableOpacity>
}

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
const largeTextButtonStyle = {
    ...constants.largeText,
    color: constants.notReallyWhite,
    alignSelf: 'center',
};

type LargeButtonProps = { title: string, style?: Object };
export function LargeButton(props: LargeButtonProps) {
    const { title, style, ...restProps } = props;

    const defaultStyle = {
        backgroundColor: constants.primaryColor,
        paddingVertical: 1 * constants.space,
        elevation: 2,
    };
    const concreteStyle = style ? Object.assign({}, defaultStyle, style) : defaultStyle;

    return (
        <TouchableOpacity style={concreteStyle} {...restProps}>
            <Text style={largeTextButtonStyle}>{title}</Text>
        </TouchableOpacity>
    );
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
    const content =
        typeof title === 'string' ? (
            <Text style={largeTextButtonStyle}>{title.toUpperCase()}</Text>
        ) : (
            title
        );

    return (
        <TouchableOpacity style={heroContainerStyle} {...restProps}>
            {content}
        </TouchableOpacity>
    );
}
