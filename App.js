import React from 'react';
import { StackNavigator } from 'react-navigation';
import { answerService } from './src/services/answer-service.js';
import { HomeScreen } from './src/components/HomeScreen.js';
import { SessionScreen } from './src/components/SessionScreen.js';

answerService.setAnswerPool(['a', 'b', 'c']);

export default App = StackNavigator({
    Home: { screen: HomeScreen },
    Session: { screen: SessionScreen },
});

