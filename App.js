import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { QuestionComponent } from './src/components/Question.js';
import { answerService } from './src/services/answer-service.js';
answerService.setAnswerPool(['a', 'b', 'c']);

export default class App extends React.Component {
    render() {
        const question = {
            type: 'word-question',
            questionText: 'THE QUESTION',
            answer: 'THE ANSWER',
        };

        return <View style={styles.container}>
            <Text>Open up App.js to start working on your app!</Text>
            <Text>Changes you make will automatically reload.</Text>
            <Text>Shake your phone to open the developer menu.</Text>

            <QuestionComponent question={ question } />
        </View>
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
