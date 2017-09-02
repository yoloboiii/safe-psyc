// @flow

import React from 'react';
import  { View } from 'react-native';

export function VerticalSpace(props: { multiplier?: number}) {
    return <View style={getMemoizedStyle(props.multiplier)} />
}

const memoizedStyles = {};
export function getMemoizedStyle(multiplier: number = 1): Object {
    if (memoizedStyles[multiplier] === undefined) {
        memoizedStyles[multiplier] = {
            height: 10 * multiplier,
        };
    }

    return memoizedStyles[multiplier];
}
