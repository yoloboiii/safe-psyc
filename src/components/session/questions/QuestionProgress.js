// @flow

import React from 'react';
import { View, Text } from 'react-native';
import * as Progress from 'react-native-progress';
import { constants } from '../../../styles/constants.js';

type Props = {
    current: number,
    total: number,
};
export function QuestionProgress(props: Props) {
    const { current, total } = props;

    const progress = (current - 1) / total;

    return (
        <View style={styles.container}>
            <Progress.Bar
                progress={progress}
                color={constants.primaryColor}
                width={null}
                height={constants.space()}
                borderRadius={constants.mediumRadius}
                animated={true}
                useNativeDriver={true}
            />
        </View>
    );
}

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
    },
};
