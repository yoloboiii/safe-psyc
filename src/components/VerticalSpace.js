// @flow

import React from 'react';
import { View } from 'react-native';
import { constants } from '../styles/constants.js';

export function VerticalSpace(props: { multiplier?: number }) {
    return <View style={getMemoizedStyle(props.multiplier)} />;
}

const memoizedStyles = {};
export function getMemoizedStyle(multiplier: number = 1): Object {
    if (memoizedStyles[multiplier] === undefined) {
        memoizedStyles[multiplier] = {
            height: constants.space(multiplier),
        };
    }

    return memoizedStyles[multiplier];
}
