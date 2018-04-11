// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Text, Button } from 'react-native';
import { constants } from '~/src/styles/constants.js';

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
            padding: constants.space(),
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
            padding: constants.space(),
        },
    },
};
type StandardButtonProps = {
    onPress: () => *,
    disabled?: boolean,
    title: string | ({ textStyle: Array<?Object>}) => Object,
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
            {contents()}
        </TouchableOpacity>
    );

    function contents() {
        if (typeof title === 'string') {
            return <Text style={[defaultStyles.text, context.buttonTextStyle, textStyle]}>
                {title}
            </Text>
        } else {
            // react-native requires components to be capitalized
            const Title = title;

            return <Title textStyle={[defaultStyles.text, context.buttonTextStyle, textStyle]} />;
        }
    }
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
        padding: constants.space(),
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

type LargeButtonProps = {
    title: string,
    containerStyle?: Object,
    textStyle?: Object,
};
export function LargeButton(props: LargeButtonProps) {
    const { title, containerStyle, textStyle, ...restProps } = props;

    const defaultStyle = {
        backgroundColor: constants.primaryColor,
        paddingVertical: constants.space(),
        elevation: 2,
    };
    return (
        <TouchableOpacity style={[defaultStyle, containerStyle]} {...restProps}>
            <Text style={[largeTextButtonStyle, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
}

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
const heroContainerStyle = {
    enabled: {
        backgroundColor: constants.hilightColor2,
        padding: constants.space(3),
        borderRadius: 10,
        elevation: 2,
    },
    disabled: {
        backgroundColor: constants.defaultTextColor,
        padding: constants.space(3),
        borderRadius: 10,
        elevation: 2,
    },
};
type HeroButtonProps = {
    title: any,
    style?: Object,
    disabled?: boolean,
};
export function HeroButton(props: HeroButtonProps) {
    const { title, style, disabled, ...restProps } = props;
    const content =
        typeof title === 'string' ? (
            <Text style={largeTextButtonStyle}>{title.toUpperCase()}</Text>
        ) : (
            title
        );

    const defaultStyles = disabled
        ? heroContainerStyle.disabled
        : heroContainerStyle.enabled;

    return (
        <TouchableOpacity
            style={[defaultStyles, style]}
            disabled={disabled}
            {...restProps}
        >
            {content}
        </TouchableOpacity>
    );
}
