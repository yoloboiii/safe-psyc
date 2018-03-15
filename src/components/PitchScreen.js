// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { View, Image, AsyncStorage } from 'react-native';
import Swiper from 'react-native-swiper';
import { StandardText, LargeText } from './Texts.js';
import { StandardButton, HeroButton } from './Buttons.js';
import { VerticalSpace } from './VerticalSpace.js';
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

    getChildContext() {
        return {
            textStyle: {
                color: constants.notReallyWhite,
            },
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
                containerStyle={{
                    backgroundColor: constants.hilightColor2,
                    height: 44,
                }}
                title={"Let's get started!"}
                onPress={this._skip.bind(this)}
            />
        ) : (
            <View style={{ height: 44 }} />
        );

        return (
            <View
                style={{
                    flex: 1,
                    padding: constants.space(),
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
PitchScreen.childContextTypes = {
    textStyle: PropTypes.object,
};

function Paragraph(props: { style?: Object }) {
    const { style, ...restProps } = props;

    const defaultStyle = { paddingBottom: constants.space(5) };

    return <View style={[defaultStyle, style]} {...restProps} />;
}

function Link(props) {
    const urlMap = new Map();
    urlMap.set(
        'https://www.nytimes.com/2016/02/28/magazine/what-google-learned-from-its-quest-to-build-the-perfect-team.html',
        'an article in the New York Times'
    );
    urlMap.set('https://rework.withgoogle.com/blog/how-to-foster-psychological-safety/', 're:Work');
    urlMap.set(
        'https://youarenotsosmart.com/2017/10/01/yanss-111-some-groups-are-smarter-than-others-and-psychologists-want-to-understand-why/',
        'YANSS #111'
    );
    urlMap.set('http://journals.plos.org/plosone/article?id=10.1371/journal.pone.0115212', 'research article');

    function urlToText(url) {
        return urlMap.get(url) || url.substring(url.indexOf('/', url.indexOf('/') + 1) + 1);
    }

    const { children, ...rest } = props;
    return <Hyperlink linkDefault={true} linkStyle={linkStyle} linkText={urlToText} {...rest}>
        <StandardText>{children}</StandardText>
    </Hyperlink>
}

function Quote(props: { text: string, by: * }) {

    return <View style={constants.flex1}>
        <View style={{
            flexDirection: 'row',
        }}>
            <Image
                // $FlowFixMe
                source={require('../../images/quote.png')}
                style={{
                    tintColor: constants.notReallyWhite,
                }}
            />
            <StandardText style={{
                flex: 1,
                color: constants.notReallyWhite,
                marginTop: constants.space(),
                marginLeft: constants.space(),
            }}>
                { props.text }
            </StandardText>
        </View>

        <View style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
        }}>
            <StandardText>{'- '}</StandardText>
            { props.by }
        </View>
    </View>
}

function ItIsImportant() {
    return (
        <View style={[styles.slideContainer, { justifyContent: 'flex-start' }]}>
            <LargeText style={{
                paddingTop: constants.space(5),
                fontWeight: constants.boldWeight,
            }}>
                Social intelligence directly impacts your team's performance
            </LargeText>
            <VerticalSpace multiplier={3} />

            <Paragraph>
                <Link>
                    According to
                    https://www.nytimes.com/2016/02/28/magazine/what-google-learned-from-its-quest-to-build-the-perfect-team.html,
                    Google found social intelligence to be the primary indicator of psycological
                    safety.
                </Link>
            </Paragraph>
            <Paragraph style={constants.flex1}>
                <Quote
                    text={"All team members can actively shape a team’s norm."}
                    by={<Link>
                            https://rework.withgoogle.com/blog/how-to-foster-psychological-safety/
                        </Link>
                    } />
            </Paragraph>

            { false && <Paragraph>
                <RightQuote
                    text="The research also found that collective intelligence was correlated with the individual group members’ ability to reason about the mental states of others."
                    by={<Link>http://journals.plos.org/plosone/article?id=10.1371/journal.pone.0115212</Link>}
                />

            </Paragraph>}

            { false && <Paragraph>
                <Link>
                    The not-smart pod episode
                    https://youarenotsosmart.com/2017/10/01/yanss-111-some-groups-are-smarter-than-others-and-psychologists-want-to-understand-why/
                </Link>
            </Paragraph>}
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

const styles = {
    slideContainer: {
        flex: 1,
        paddingHorizontal: constants.space(2),
    },
};
