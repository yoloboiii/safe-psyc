// @flow

// TODO: Allow the user to change their mind even after submitting the emotion

import React from 'react';
import { View, Image, TouchableHighlight, ActivityIndicator } from 'react-native';
import { StandardText } from './Texts.js';
import { StandardButton } from './Buttons.js';
import { VerticalSpace } from './VerticalSpace.js';
import { SquareGrid } from './SquareGrid.js';
import { constants } from '../styles/constants.js';
import { log } from '../services/logger.js';

type Props = {
    backendFacade: CurrentEmotionBackendFacade,
    emotionImages: { [string]: Array<string> },
    onAnswered: () => void,
    onSkip?: () => void,
};
type State = {
    selectedEmotion: ?string,
    submissionState: 'not-started' | 'submitting' | 'successful' | 'failed',
    selectedImages: Array<{ emotion: string, image: string}>,
};

export class PhotographicAffectMeter extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            selectedEmotion: null,
            submissionState: 'not-started',
            selectedImages: this._selectImages(),
        };
    }

    _selectImages() {
        const images = [];
        for (const emotion of Object.keys(this.props.emotionImages)) {
            const image = randomElement(this.props.emotionImages[emotion])

            images.push({
                emotion,
                image,
            });
        }
        return images;
    }

    _chooseEmotionWord(emotion) {
        this.setState(
            {
                submissionState: 'submitting',
            },
            () => {
                this.props.backendFacade
                    .registerCurrentEmotion(emotion)
                    .then(() => {
                        log.debug('Current emotion saved');
                        this.setState({
                            submissionState: 'successful',
                        });
                    })
                    .catch(e => {
                        this.setState({
                            submissionState: 'failed',
                        });
                        log.error('Failed saving current emotion', e);
                        Alert.alert('Save failure', e.message);
                    });
            }
        );
    }

    render() {
        const submitButton = this._createSubmitButton();
        const skipButton = this._createSkipButton();

        return (
            <View style={constants.padflex}>
                <StandardText>
                    Please choose the image that best illustrates how you are feeling right now
                </StandardText>
                <VerticalSpace />

                <PhotoGrid
                    emotionImages={this.state.selectedImages}
                    onSelect={emotion => this.setState({ selectedEmotion: emotion })}
                    selectedEmotion={this.state.selectedEmotion}
                    disabled={['successful', 'submitting'].includes(this.state.submissionState)}
                />

                <VerticalSpace multiplier={2} />

                <StandardText>
                {
                    this.state.selectedEmotion &&
                    this.state.submissionState !== 'successful' &&
                        'Are you feeling ' + this.state.selectedEmotion + '?'
                }
                </StandardText>

                <View style={styles.buttonRowStyle}>
                    {skipButton}
                    {submitButton}
                </View>
            </View>
        );
    }

    _createSubmitButton() {
        switch (this.state.submissionState) {
            case 'successful':
                return <StandardButton
                    testName='submitButton'
                    title={'Success!'}
                    onPress={this.props.onAnswered}
                />;
            case 'failed':
            case 'not-started':
                const disabled = this.state.selectedEmotion === null;
                return (
                    <StandardButton
                        testName='submitButton'
                        containerStyle={{ minWidth: 140 }}
                        disabled={disabled}
                        title={ disabled ? 'Save' : 'Yes'}
                        onPress={() => this._chooseEmotionWord(this.state.selectedEmotion)}
                    />
                );

            case 'submitting':
                return <ActivityIndicator />;
        }
    }

    _createSkipButton() {
        if (this.props.onSkip) {
            return <StandardButton title={'Skip'} onPress={this.props.onSkip} />;
        } else {
            return <View />;
        }
    }
}

function PhotoGrid(props) {

    const containerStyle = {
        margin: constants.space / 2,
    };
    const borderWidth = constants.space / 2;
    const selectedImageStyle = {
        borderWidth,
        borderColor: constants.primaryColor,

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
                const containerStyles = [containerStyle];
                if (isSelected) {
                    containerStyles.push(selectedImageStyle);
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

function randomElement(array) {
    const rnd = Math.floor(Math.random() * array.length);
    return array[rnd];
}

const styles = {
    buttonRowStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
}
