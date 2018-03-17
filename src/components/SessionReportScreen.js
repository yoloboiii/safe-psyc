// @flow

import React from 'react';
import { View, ScrollView } from 'react-native';
import { StandardText } from './Texts.js';
import { StandardButton } from './Buttons.js';
import { VerticalSpace } from './VerticalSpace.js';
import { SessionReport } from './SessionReport.js';

import { paramsOr, routeToCurrentFeelingOrHome } from '../navigation-actions.js';
import { currentEmotionBackendFacade } from '../services/current-emotion-backend.js';
import { constants } from '../styles/constants.js';

import type { Navigation } from '../navigation-actions.js';
import type { Question } from '../models/questions.js';
import type { Emotion } from '../models/emotion.js';
import type { Report } from './SessionReport.js';

const backgroundStyle = {
    backgroundColor: constants.notReallyWhite,
    flex: 1,
};

type Props = {
    navigation: Navigation<{
        report: Report,
    }>,
};
export class SessionReportScreen extends React.Component<Props, {}> {

    static navigationOptions = {
        title: 'Session Report',
        headerLeft: <View/>,
    };

    _onDismiss() {
        routeToCurrentFeelingOrHome(this.props.navigation, currentEmotionBackendFacade);
    }

    render() {
        const report = paramsOr(this.props.navigation, { report: new Map() }).report;

        return (
            <ScrollView style={backgroundStyle} contentContainerStyle={constants.padding}>
                <StandardText>
                    Great job! Congratulations on finishing the session, here's a summary of the
                    emotions you saw!
                </StandardText>

                <VerticalSpace multiplier={4} />
                <SessionReport report={report} navigation={this.props.navigation} />
                <VerticalSpace multiplier={4} />

                <StandardButton title={'Done!'} onPress={this._onDismiss.bind(this)} />
            </ScrollView>
        );
    }
}
