// @flow

import React from 'react';
import { Kaede } from 'react-native-textinput-effects';
import { constants } from '../../styles/constants.js';

const kaedeLabelStyle = {
    color: constants.notReallyWhite,
    backgroundColor: constants.hilightColor2,
};
const kaedeInputStyle = {
    ...constants.normalText,
};

type Props = {
    label: string,
    value: string,
    onChange: (string) => void,
};
export function FancyInput(props: Props) {
    const { label, value, onChange, ...rest } = props;
    return <Kaede
            labelStyle={kaedeLabelStyle}
            inputStyle={kaedeInputStyle}
            label={label}
            value={value}
            onChangeText={onChange}

            {...rest}
        />
}
