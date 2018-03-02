// @flow

import React from 'react';
import { View, AsyncStorage } from 'react-native';
import Swiper from 'react-native-swiper';
import { StandardText, LargeText } from './Texts.js';
import { StandardButton, HeroButton } from './Buttons.js';
import Hyperlink from 'react-native-hyperlink';
import { resetToLogin } from '../navigation-actions.js';
import { paramsOr } from '../navigation-actions.js';
import { log } from '../services/logger.js';
import { constants } from '../styles/constants.js';

import type { Navigation } from '../navigation-actions.js';

const linkStyle = {
    color: constants.hilightColor2,
    textDecorationLine: 'underline',
};

type Props = {
    navigation: Navigation<{
        storage?: AsyncStorage,
    }>,
};
type State = {
    showSkipButton: boolean,
};
export class PitchScreen extends React.Component<Props, State> {
    static navigationOptions = {
        header: null,
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            showSkipButton: true,
        };
    }

    _skip() {
        const storage = paramsOr(this.props.navigation, {
            storage: AsyncStorage,
        }).storage;
        // $FlowFixMe
        storage
            .setItem('hasSeenThePitch', 'true')
            .then(() => {
                log.debug('Successfully persisted to skip the pitch');
            })
            .catch(e => {
                log.error('Unable to persist that the pitch is to be skipped: %s', e);
            });

        resetToLogin(this.props.navigation);
    }

    render() {
        const skipButton = this.state.showSkipButton ? (
            <StandardButton
                customColor={constants.hilightColor2}
                title={"Let's get started!"}
                onPress={this._skip.bind(this)}
            />
        ) : (
            <View style={{ height: 35 }} />
        );

        return (
            <View
                style={{
                    flex: 1,
                    padding: constants.space,
                    backgroundColor: constants.primaryColor,
                }}
            >
                <Swiper
                    style={constants.flex1}
                    dotColor={constants.defaultTextColor}
                    activeDotColor={constants.hilightColor2}
                    loop={false}
                    showsButtons={true}
                    nextButton={<StandardText>{'>'}</StandardText>}
                    prevButton={<StandardText>{'<'}</StandardText>}
                    onIndexChanged={index =>
                        this.setState({
                            showSkipButton: index !== 4,
                        })
                    }
                >
                    <ItIsImportant />
                    <ItCanBeImproved />
                    <HowSPDoesIt1 />
                    <HowSPDoesIt2 />
                    <LetsStart onStart={this._skip.bind(this)} />
                </Swiper>

                {skipButton}
            </View>
        );
    }
}

function Paragraph(props: { style?: Object }) {
    const { style, ...restProps } = props;

    const defaultStyle = { paddingTop: constants.space };
    const actualStyle = Object.assign({}, defaultStyle, style);
    return <StandardText style={actualStyle} {...restProps} />;
}

function ItIsImportant() {
    const urlMap = new Map();
    urlMap.set(
        'https://www.nytimes.com/2016/02/28/magazine/what-google-learned-from-its-quest-to-build-the-perfect-team.html',
        'a nytimes article'
    );
    urlMap.set('https://rework.withgoogle.com/blog/how-to-foster-psychological-safety/', 're:Work');
    urlMap.set(
        'https://youarenotsosmart.com/2017/10/01/yanss-111-some-groups-are-smarter-than-others-and-psychologists-want-to-understand-why/',
        'YANSS #111'
    );

    function urlToText(url) {
        return urlMap.get(url) || url.substring(url.indexOf('/', url.indexOf('/') + 1) + 1);
    }

    return (
        <View>
            <LargeText style={{ paddingTop: constants.space * 5 }}>
                Social intelligence directly impacts your team's performance
            </LargeText>

            <Hyperlink linkDefault={true} linkStyle={linkStyle} linkText={urlToText}>
                <Paragraph>
                    According to
                    https://www.nytimes.com/2016/02/28/magazine/what-google-learned-from-its-quest-to-build-the-perfect-team.html,
                    Google found social intelligence to be the primary indicator to psycological
                    safety.
                </Paragraph>
                <Paragraph>
                    "All team members can actively shape a team’s norm." -
                    https://rework.withgoogle.com/blog/how-to-foster-psychological-safety/
                </Paragraph>
                <Paragraph>
                    The not-smart pod episode
                    https://youarenotsosmart.com/2017/10/01/yanss-111-some-groups-are-smarter-than-others-and-psychologists-want-to-understand-why/
                </Paragraph>
            </Hyperlink>
        </View>
    );
}

function ItCanBeImproved() {
    return (
        <View>
            <StandardText>Repetition can improve your SI</StandardText>
            <StandardText>Sources....</StandardText>
        </View>
    );
}

function HowSPDoesIt1() {
    return (
        <View>
            <StandardText>This app does it like this..</StandardText>
            <View style={{ width: 400, height: 500, backgroundColor: 'red' }} />
        </View>
    );
}
function HowSPDoesIt2() {
    return (
        <View>
            <StandardText>This app does it like this..</StandardText>
            <View style={{ width: 400, height: 500, backgroundColor: 'green' }} />
        </View>
    );
}

function LetsStart(props) {
    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 2 }} />

            <View style={{ flex: 1 }}>
                <HeroButton title={"Let's get started!"} onPress={props.onStart} />
            </View>
        </View>
    );
}
