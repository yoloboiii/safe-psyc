// @flow

import React from 'react';
import { View, ImageBackground as ImgBg } from 'react-native';

const bgImageStyle = {
    width: '100%',
    height: '100%',
};
const contentStyle = {
    height: '100%',
    backgroundColor: 'rgba(255, 193, 69, 0.6)',
    flex: 1,
};

type Props = {
    image?: any,
    children: any,
};
export function ImageBackground(props: Props) {
    const { children, image } = props;

    // $FlowFixMe
    const img = image || require('../../images/home-bg.jpg');

    return <ImgBg source={ img }
        resizeMode='cover'
        style={ bgImageStyle }>

        <View style={ contentStyle }>
            { children }
        </View>
    </ImgBg>
}
