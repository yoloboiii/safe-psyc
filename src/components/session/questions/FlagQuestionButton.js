// @flow

import React from 'react';
import { Image, TouchableOpacity, Alert } from 'react-native';
import { ActivityIndicator } from '~/src/components/lib/ActivityIndicator.js';
import { constants } from '~/src/styles/constants.js';
import { flagQuestionBackendFacade } from '~/src/services/flag-question-backend.js';
import { log } from '~/src/services/logger.js';

import type { Question } from '~/src/models/questions.js';

type Props = {
    question: Question,
    style?: Object,
};
type State  = {
    status: 'not-submitted' | 'submitting' | 'success' | Error,
};
export class FlagQuestionButton extends React.Component<Props, State> {

    sizeStyle = {
        width: constants.space(3),
        height: constants.space(3),
    };
    iconStyle = {
        ...this.sizeStyle,
        tintColor: constants.notReallyWhite,
    };

    constructor() {
        super();
        this.state = {
            status: 'not-submitted',
        };
    }

    _flag() {
        const { question } = this.props;
        log.debug('Flagging question %s-%s...', question.correctAnswer.name, question.type);

        this.setState({ status: 'submitting' }, () => {

            flagQuestionBackendFacade.flagQuestion(question)
                .then( flagId => {
                    log.debug('Successfully flagged question %s-%s, id: %s', question.correctAnswer.name, question.type, flagId);

                    this.setState({ status: 'success' });

                    Alert.alert(
                        'Question flagged',
                        'An administrator will look at the question and make sure it is up to our standards',
                        [
                            {
                                text: 'Eh, I was just exploring!',
                                onPress: () => this._unflag(flagId),
                            },
                            {
                                text: 'Ok',
                            },
                        ],
                    );
                })
                .catch( e => {
                    log.error('Unable to flag question %s-%s, %s', question.correctAnswer.name, question.type, e);

                    this.setState({ status: e });
                    Alert.alert('Something went wrong', 'Unable to flag the question. This has been logged and someone will look into it');
                });
        });
    }

    _unflag(id) {
        const { question } = this.props;

        log.debug('Unflagging question %s-%s...', question.correctAnswer.name, question.type);

        this.setState({ status: 'submitting' }, () => {

            flagQuestionBackendFacade.unflagQuestion(question, id)
                .then( () => {
                    Alert.alert('All good!', 'The flagging was removed, it\'s like it never happened');

                    this.setState({ status: 'not-submitted' });
                })
                .catch( e => {
                    log.error('Unable to unflag flag-id %s, %s', id, e);

                    this.setState({ status: 'not-submitted' });

                    Alert.alert('Eh..', 'Unable remove the flagging, but this has been logged and the flag will be ignored :)');
                });
        });
    }

    render() {
        const { status } = this.state;
        const { style } = this.props;

        const concreteStyle = [this.iconStyle, style];
        if (status instanceof Error) {
            return <Image
                // $FlowFixMe
                source={require('../../../../images/error.png')}
                style={concreteStyle}
            />
        }

        if (status === 'submitting') {
            return <ActivityIndicator style={[this.sizeStyle, style]} />
        }

        if (status === 'success') {
            return <Image
                // $FlowFixMe
                source={require('../../../../images/success.png')}
                style={concreteStyle}
            />
        }

        // $FlowFixMe
        const flagIcon = require('../../../../images/flag.png');

        return <TouchableOpacity onPress={ () => this._flag() }>
                <Image
                    source={flagIcon}
                    style={concreteStyle}
                />
            </TouchableOpacity>
    }
}
