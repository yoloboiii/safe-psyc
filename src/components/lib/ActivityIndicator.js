// @flow

import React from 'react';
import { ActivityIndicator as RNActivityIndicator } from 'react-native';
import { constants } from '../../styles/constants.js';

type Props = {
    size: 'small' | 'large',
    color: string,
};
export function ActivityIndicator(props: Props) {
    return <RNActivityIndicator {...props} />
}
ActivityIndicator.defaultProps = {
    size: 'small',
    color: constants.notReallyWhite,
};
