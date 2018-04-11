// @flow

import React from 'react';
import { View } from 'react-native';
import { constants } from '~/src/styles/constants.js';

const triangleBorderStyle = {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderRightWidth: 200,
    borderTopWidth: 50,
    borderRightColor: 'transparent',
    borderTopColor: constants.notReallyWhite,
};
const unfilledTriangleStyle = {
    backgroundColor: 'gray',
    width: triangleBorderStyle.borderRightWidth,
    height: triangleBorderStyle.borderTopWidth,
};
const filledTriangleStyle = {
    backgroundColor: 'red',
    height: triangleBorderStyle.borderTopWidth,
    position: 'absolute',
};
export function TriangularMeter(props: { percent: number }) {
    const { percent, ...restProps } = props;
    return (
        <View {...restProps}>
            <View style={unfilledTriangleStyle}>
                <View
                    style={{
                        ...filledTriangleStyle,
                        ...{ width: percent + '%' },
                    }}
                />
                <View style={triangleBorderStyle} />
            </View>
        </View>
    );
}
