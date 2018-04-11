// @flow

import React from 'react';
import { View, ScrollView } from 'react-native';
import { StandardText } from '~/src/components/lib/Texts.js';
import { StandardButton } from '~/src/components/lib/Buttons.js';
import { VerticalSpace } from '~/src/components/lib/VerticalSpace.js';
import { SessionReport } from './SessionReport.js';

import { paramsOr, routeToCurrentFeelingOrHome } from '~/src/navigation-actions.js';
import { currentEmotionBackendFacade } from '~/src/services/current-emotion-backend.js';
import { constants } from '~/src/styles/constants.js';

import type { Navigation } from '~/src/navigation-actions.js';
import type { Question } from '~/src/models/questions.js';
import type { Emotion } from '~/src/models/emotion.js';
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
        routeToCurrentFeelingOrHome(currentEmotionBackendFacade);
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
                <SessionReport report={report} />
                <VerticalSpace multiplier={4} />

                <StandardButton title={'Done!'} onPress={this._onDismiss.bind(this)} />
            </ScrollView>
        );
    }
}
