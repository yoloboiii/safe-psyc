// @flow

import React from 'react';
import { View } from 'react-native';
import { StandardText } from './Texts.js';
import { constants } from '../styles/constants.js';
import Hyperlink from 'react-native-hyperlink';

const linkStyle = {
    color: constants.hilightColor2,
    textDecorationLine: 'underline',
};
export function Credits() {
    return (
        <View>
            <Hyperlink linkDefault={true} linkStyle={linkStyle} linkText={urlToText}>
                <StandardText>
                    Settings icon made by https://smashicons.com from www.flaticon.com
                </StandardText>
            </Hyperlink>
        </View>
    );
}

function urlToText(url) {
    if (url === 'https://smashicons.com') {
        return 'Smashicons';
    }

    return url.substring(url.indexOf('/', url.indexOf('/') + 1) + 1);
}
