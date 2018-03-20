// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { View, ImageBackground as ImgBg } from 'react-native';
import { constants } from '../../styles/constants.js';

const bgImageStyle = {
    width: '100%',
    height: '100%',
};
const contentStyle = {
    height: '100%',
    backgroundColor: 'rgba(253,184,7, 0.4)',
    flex: 1,
};

type Props = {
    image?: any,
    children: any,
};
export class ImageBackground extends React.Component<Props, {}> {

    getChildContext() {
        return {
            textStyle: {
                color: constants.notReallyWhite,
            },
        };
    }

    render() {
        const { children, image } = this.props;

        // $FlowFixMe
        const img = image || require('../../../images/stripes.png');

        return (
            <ImgBg source={img} resizeMode="cover" style={bgImageStyle}>
                <View style={contentStyle}>{children}</View>
            </ImgBg>
        );
    }
}

ImageBackground.childContextTypes = {
    textStyle: PropTypes.object,
};
