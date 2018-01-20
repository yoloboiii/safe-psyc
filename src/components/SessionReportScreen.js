// @flow

import React from 'react';
import { ScrollView } from 'react-native';
import { StandardText } from './Texts.js';
import { StandardButton } from './Buttons.js';
import { VerticalSpace } from './VerticalSpace.js';
import { SessionReport } from './SessionReport.js';

import {
    paramsOr,
    routeToCurrentFeelingOrHome,
} from '../navigation-actions.js';
import { backendFacade } from '../services/backend.js';
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
    _onDismiss() {
        routeToCurrentFeelingOrHome(this.props.navigation, backendFacade);
    }

    render() {
        const report = paramsOr(this.props.navigation, { report: new Map() })
            .report;

        return (
            <ScrollView
                style={backgroundStyle}
                contentContainerStyle={constants.padding}
            >
                <StandardText>
                    Great job! Congratulations on finishing the session, here's
                    a summary of how it went!
                </StandardText>

                <VerticalSpace multiplier={4} />
                <SessionReport
                    report={report}
                    navigation={this.props.navigation}
                />
                <VerticalSpace multiplier={4} />

                <StandardButton
                    title={'Thanks!'}
                    onPress={this._onDismiss.bind(this)}
                />
            </ScrollView>
        );
    }
}
