// @flow

import React from 'react';
import { QuestionDetails } from './QuestionDetails.js';
import { Text } from 'react-native';

import type { Navigation } from '../navigation-actions.js';
import type { Question } from '../models/questions.js';

type Props = {
    navigation: Navigation<{
        question: Question,
    }>,
}
export class QuestionDetailsScreen extends React.Component<Props, {}> {
    static navigationOptions = {
        title: 'QUESTION DETAILS',
    };

    render() {
        const { state, navigate } = this.props.navigation;
        if (state) {
            const navParams = state.params;

            return <QuestionDetails
                question={ navParams.question } />

        } else {
            return <Text>No navigation state! Don't know what to do</Text>

        }
    }
}
