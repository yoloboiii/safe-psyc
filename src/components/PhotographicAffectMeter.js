// @flow

// TODO: Allow the user to change their mind even after submitting the emotion

import React from 'react';
import { View, Image, TouchableHighlight, TouchableOpacity, Alert } from 'react-native';
import { StandardText } from './lib/Texts.js';
import { StandardButton, SecondaryButton } from './lib/Buttons.js';
import { VerticalSpace } from './lib/VerticalSpace.js';
import { SquareGrid } from './lib/SquareGrid.js';
import { ActivityIndicator } from './lib/ActivityIndicator.js';
import { constants } from '../styles/constants.js';
import { log } from '../services/logger.js';
import { randomElement } from '../utils/array-utils.js';

import type { CurrentEmotionBackendFacade } from '../services/current-emotion-backend.js';

type Props = {
    backendFacade: CurrentEmotionBackendFacade,
    emotionImages: { [string]: Array<string> },
    onAnswered: () => void,
    onSkip?: () => void,
};
type State = {
    selectedEmotion: ?string,
    submissionState: 'not-started' | 'submitting' | 'successful' | Error,
    submittedEmotion: ?string,
    selectedImages: Array<{ emotion: string, image: string}>,
    dbId: ?string,
};

const emotionOrder = [
    'afraid',
    'tense',
    'excited',
    'delighted',
    'frustrated',
    'angry',
    'happy',
    'glad',
    'miserable',
    'sad',
    'calm',
    'satisfied',
    'gloomy',
    'tired',
    'sleepy',
    'serene',
];
export class PhotographicAffectMeter extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            selectedEmotion: null,
            submissionState: 'not-started',
            submittedEmotion: null,
            selectedImages: this._selectImages(),
            dbId: null,
        };
    }

    _selectImages() {
        const currentImages = this.state
            ? (this.state.selectedImages || []).map(i => i.image)
            : null;

        const images = [];
        for (const emotion of Object.keys(this.props.emotionImages)) {
            const image = randomElement(this.props.emotionImages[emotion], currentImages)

            images.push({
                emotion,
                image,
            });
        }

        images.sort((a,b) => {
            const ai = emotionOrder.indexOf(a.emotion);
            const bi = emotionOrder.indexOf(b.emotion);

            return ai - bi;
        });
        return images;
    }

    componentDidMount() {
        this.setState({
            dbId: null,
        });
    }

    _chooseEmotionWord(emotion) {
        if (!emotion) {
            log.warning("Attempted to submit emotion without first selecting one");
            return;
        }

        this.setState(
            {
                submissionState: 'submitting',
            },
            () => {
                const dbId = this.props.backendFacade
                    .registerCurrentEmotion(emotion, (error) => {

                        if (error) {
                            this.setState({
                                submissionState: error,
                            });
                            log.error('Failed saving current emotion', error);
                            Alert.alert('Save failure', error.message);
                        } else {
                            log.debug('Current emotion saved');
                            this.setState({
                                submissionState: 'successful',
                                submittedEmotion: emotion,
                            });
                        }
                    }, this.state.dbId)

                this.setState({ dbId });
            }
        );
    }

    _showHelp() {
        Alert.alert(null, 'An important part of emotional intelligence is learning to identify your feelings. This is a Photographic Affect Meter and can help you put words to what you\'re feeling.');
    }

    render() {
        const skipButton = this._createSkipButton();
        const doNotChangeButton = this._createDoNotChangeButton();
        const submitButton = this._createSubmitButton();

        const apa = <StandardText>
                    </StandardText>
        return (
            <View style={styles.container}>
                <View>
                    <View style={{ flexDirection: 'row' }}>
                        <StandardText style={{ maxWidth: '90%' }}>
                            Please choose the image that best illustrates how you are feeling right now.
                        </StandardText>

                        <TouchableOpacity onPress={ () => this._showHelp() }>
                            <Image
                                // $FlowFixMe
                                source={require('../../images/help.png')}
                                style={{
                                    tintColor: constants.defaultTextColor,
                                    width: 30,
                                    height: 30,
                                }} />
                        </TouchableOpacity>
                    </View>
                    <VerticalSpace multiplier={3} />

                    <PhotoGrid
                        emotionImages={this.state.selectedImages}
                        onSelect={emotion => this.setState( s => ({
                            selectedEmotion: emotion,
                            submissionState: 'not-started',
                        }))}
                        selectedEmotion={this.state.selectedEmotion}
                        submittedEmotion={this.state.submittedEmotion}
                        disabled={this.state.submissionState === 'submitting'}
                    />
                    <VerticalSpace />
                    <SecondaryButton
                        testName='newImages'
                        title="shuffle images"
                        textStyle={{ textAlign: 'right' }}
                        onPress={ () => this.setState({
                            selectedImages: this._selectImages(),
                        })}
                    />
                </View>

                <View>
                    { this._createConfirmationText() }
                    <View style={styles.buttonRowStyle}>
                        {skipButton}
                        <View style={{ flexDirection: 'row' }}>
                            {doNotChangeButton}
                            {submitButton}
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    _createSubmitButton() {

        if (this.state.submissionState === 'submitting') {
            return <ActivityIndicator />;
        }

        const disabled = this.state.selectedEmotion === null;

        const title = disabled
            ? 'Save'
            : this.state.selectedEmotion === this.state.submittedEmotion
            ? 'Success!'
            : this.state.submittedEmotion === null
            ? 'Yes'
            : 'Change';

        const onPress = title === 'Success!'
            ? this.props.onAnswered
            : () => this._chooseEmotionWord(this.state.selectedEmotion);

        return (
            <StandardButton
                testName='submitButton'
                containerStyle={{ minWidth: 140 }}
                disabled={disabled}
                title={title}
                onPress={onPress}
            />
        );
    }

    _createDoNotChangeButton() {
        const { selectedEmotion, submittedEmotion, submissionState } = this.state;

        const hasSubmitted = submittedEmotion !== null;
        const changed = selectedEmotion !== submittedEmotion;
        if (!hasSubmitted || !changed) {
            return null;
        }

        return <StandardButton
            testName='nah-correct'

            title='Nah, it was correct'
            onPress={this.props.onAnswered}

            containerStyle={{ marginRight: constants.space() }}
            disabled={submissionState === 'submitting'}
        />
    }

    _createSkipButton() {
        const hasOnSkipProp = !!this.props.onSkip;
        const hasSubmittedSuccessfully = this.state.submissionState === 'successful';

        if (!hasOnSkipProp || hasSubmittedSuccessfully) {
            // If this is null the save button gets left-aligned, I want it right-aligned.
            return <View />;
        }

        return <StandardButton
            title={'Skip'}
            // $FlowFixMe: This is guaranteed to be non-null by the if-statement above :(
            onPress={this.props.onSkip}
            disabled={this.state.submissionState === 'submitting'}
        />;
    }

    _createConfirmationText() {
        const { selectedEmotion, submissionState, submittedEmotion } = this.state;

        if (submissionState === 'successful'
            || selectedEmotion === null || selectedEmotion === undefined
            || selectedEmotion === submittedEmotion) {
            return <StandardText>{'\u0020'}</StandardText>
        }

        if (submissionState instanceof Error) {
            return <StandardText>{'Unable to submit, ' + submissionState.message}</StandardText>
        }

        if (submittedEmotion === null) {
            return <StandardText
                    style={styles.confirmationText}
                >
                    {'Are you feeling ' + selectedEmotion + '?'}
                </StandardText>
        }

        return <StandardText
                style={styles.confirmationText}
            >
                {'Did you mean ' + selectedEmotion + '?'}
            </StandardText>
    }
}

function PhotoGrid(props) {

    const containerStyle = {
        margin: constants.space(0.5),
    };
    const borderWidth = constants.space(0.5);
    const selectedImageStyle = {
        borderWidth,
        borderColor: constants.primaryColor,

        margin: containerStyle.margin - borderWidth,
    };
    const submittedImageStyle = {
        borderWidth,
        borderColor: constants.hilightColor2,

        margin: containerStyle.margin - borderWidth,
    };

    return <SquareGrid
            items={props.emotionImages}
            keyExtractor={ (a) => {
                return a.map(aa => aa.emotion).join('-');
            }}
            itemsPerRow={4}
            renderItem={(emotionImage) => {

                const isSelected = emotionImage.emotion === props.selectedEmotion;
                const isSubmitted = emotionImage.emotion === props.submittedEmotion;
                const containerStyles = [containerStyle];
                if (isSelected) {
                    containerStyles.push(selectedImageStyle);
                } else if (isSubmitted) {
                    containerStyles.push(submittedImageStyle);
                }

                return <TouchableHighlight
                    key={emotionImage.emotion}
                    testName={emotionImage.emotion}
                    onPress={ () => props.onSelect(emotionImage.emotion) }
                    style={containerStyles}
                    disabled={props.disabled}
                >
                    <Image
                        style={{
                            width: 70,
                            height: 70,
                        }}
                        source={{ uri: emotionImage.image }} />
                </TouchableHighlight>
            }}
        />
}

const styles = {
    container: {
        ...constants.padflex,
        justifyContent: 'space-between',
    },
    buttonRowStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 45,

        marginTop: constants.space(),
    },

    confirmationText: {
        textAlign: 'right',
    },
}
