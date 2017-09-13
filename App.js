import React from 'react';
import { StackNavigator } from 'react-navigation';
import { StatusBar, Platform } from 'react-native';

import { HomeScreen } from './src/components/HomeScreen.js';
import { SessionScreen } from './src/components/SessionScreen.js';
import { QuestionDetailsScreen } from './src/components/QuestionDetailsScreen.js';

import { answerService } from './src/services/answer-service.js';

answerService.setAnswerPool(['a', 'b', 'c']);

const statusBarHeight = Platform.OS === 'ios'
    ? 20
    : StatusBar.currentHeight;

const headerHeightFix = {
    navigationOptions: {
        headerStyle: {
            marginTop: statusBarHeight,
        },
    }
};

// ALL ROUTES HERE MUST CONTAIN THE ...headerHeightFix SHIT TO
// MAKE THE VIEW RENDER BELOW THE STATUS BAR
export default App = StackNavigator({
    Home: { screen: HomeScreen, ...headerHeightFix },
    Session: { screen: SessionScreen, ...headerHeightFix },
    QuestionDetails: { screen: QuestionDetailsScreen, ...headerHeightFix },
});

