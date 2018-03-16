// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { View, Image, AsyncStorage } from 'react-native';
import Swiper from 'react-native-swiper';
import LinearGradient from 'react-native-linear-gradient';
import { StandardText, LargeText } from './Texts.js';
import { ZoomAndRiseButton } from './lib/ZoomAndRiseButton.js';
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
    textShadowColor: 'transparent',
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
                textShadowColor: 'rgba(0, 0, 0, 0.2)',
                textShadowOffset: {width: 0, height: 1},
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
        const skipButton = <ZoomAndRiseButton
                style={{
                    backgroundColor: constants.hilightColor2,
                }}
                title={"Let's get started!"}
                onPress={this._skip.bind(this)}
                animate={!this.state.showSkipButton}
            />

        return (
            <LinearGradient
                colors={['#ffd533', constants.primaryColor]}
                start={{x: 0.8, y: 0.0}}
                end={{x: 0.3, y: 0.18}}
                style={{
                    flex: 1,
                    padding: constants.space(),
                    backgroundColor: constants.primaryColor,
                }}
            >
                <Swiper
                    style={constants.flex1}
                    dotColor={'rgba(255,255,255, 0.2)'}
                    activeDotColor={constants.hilightColor2}
                    loop={false}

                    showsButtons={false}

                    onIndexChanged={index =>
                        this.setState({
                            showSkipButton: index !== 3,
                        })
                    }
                >
                    <ItIsImportantForYou />
                    <ItIsImportantForTheTeam />
                    <ItCanBeImproved />
                    <LetsStart onStart={this._skip.bind(this)} />
                </Swiper>

                {skipButton}
            </LinearGradient>
        );
    }
}
PitchScreen.childContextTypes = {
    textStyle: PropTypes.object,
};

function Paragraph(props: { style?: Object, children?: Object }) {
    const { style, children, ...restProps } = props;

    const defaultStyle = { paddingBottom: constants.space(5) };
    const concreteStyle = [defaultStyle, style];

    if (typeof children === 'string') {
        return <StandardText style={concreteStyle} {...restProps}>
            {children}
        </StandardText>
    }
    return <View style={concreteStyle} {...restProps} children={children} />;
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
    urlMap.set('https://hbr.org/2013/05/can-you-really-improve-your-em', 'Harvard Business Review');

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

function TitledSlide(props) {
    return (
        <View style={[styles.slideContainer, { justifyContent: 'flex-start' }]}>
            <LargeText style={{
                paddingTop: constants.space(5),
                fontWeight: constants.boldWeight,
            }}>
                {props.title}
            </LargeText>
            <VerticalSpace multiplier={3} />

            {props.children}
        </View>
    )
}

function ItIsImportantForYou() {
    return <TitledSlide
        title="High EQ is a significant indicator of happiness and success"
        >
            <Paragraph style={constants.flex1}>
                <Quote
                    text="Studies have shown that a high emotional quotient (or EQ) boosts career success, entrepreneurial potential, leadership talent, health, relationship satisfaction, humor, and happiness."
                    by={<Link>https://hbr.org/2013/05/can-you-really-improve-your-em</Link>}
                />
            </Paragraph>
        </TitledSlide>
}

function ItIsImportantForTheTeam() {
    return (
        <TitledSlide
            title="Social intelligence directly impacts your team's performance"
        >
            {/* Required for the tests, the tag=10 thing */}
            <View>
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
                    <Quote
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
        </TitledSlide>
    );
}

function ItCanBeImproved() {
    return (
        <View style={[styles.slideContainer, { justifyContent: 'space-between', alignItems: 'flex-end'} ]}>

            <View style={{ height: '55%', justifyContent: 'flex-end' }}>
                <LargeText style={{
                    fontWeight: constants.boldWeight,
                }}>
                    You can improve your EQ!
                </LargeText>
            </View>

            <View style={constants.flex1}>
                <StandardText
                    style={{
                        textAlign: 'right',
                        marginTop: constants.space(),
                        marginRight: constants.space(),
                        maxWidth: '50%',
                    }}
                >
                    and safe-psyc will help you do just that!
                </StandardText>
            </View>
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
    // This is just an empty screen where the ZoomAndRiseButton can rise to
    return <View/>
}

const styles = {
    slideContainer: {
        flex: 1,
        paddingHorizontal: constants.space(2),
    },
};
