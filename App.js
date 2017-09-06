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
            <View style={wtfClockBarHeightFuckStyle} />

            <QuestionComponent
                question={ question }
                answerService={ answerService } />
        </View>
    }
}

const wtfClockBarHeightFuckStyle = {
    height: 50,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
