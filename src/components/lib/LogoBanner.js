// @flow

import React from 'react';
import { View } from 'react-native';
import { Title } from '~/src/components/lib/Texts.js';
import { constants } from '~/src/styles/constants.js';

export function LogoBanner() {
    return <View>
        <View style={{
            position: 'absolute',

            width: 310,
            height: 0,
            borderTopWidth: 91, // the height of the thing
            borderTopColor: constants.primaryColor,

            borderRightWidth: 20,
            borderRightColor: 'transparent',
        }}/>
            <Title style={{
                paddingLeft: constants.space(2),
                color: constants.notReallyWhite,
                textShadowColor: 'transparent',
            }}>
                safe{"\n"}
                psyc
            </Title>
    </View>
}
