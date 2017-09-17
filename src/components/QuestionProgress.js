// @flow

import React from 'react';
import { Text } from 'react-native';

type Props = {
    current: number,
    total: number,
};
export function QuestionProgress(props: Props) {
    const { current, total } = props;
    return <Text>Question { current } of { total }</Text>
};

