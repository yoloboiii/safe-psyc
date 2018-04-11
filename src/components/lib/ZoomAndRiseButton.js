// @flow

import React from 'react';
import { View, Button, Animated, Easing, TouchableOpacity } from 'react-native';
import { StandardText } from '~/src/components/lib/Texts.js';
import { constants } from '~/src/styles/constants.js';

type Props = {
    title: string,
    onPress: () => void,
    style?: Object,

    animate?: boolean,
};
type State = {
    jsVal: *,
    nativeVal: *,

    animateForwards: boolean,
};
export class ZoomAndRiseButton extends React.Component<Props, State> {

    constructor() {
        super();
        this.state = {
            jsVal: new Animated.Value(0),
            nativeVal: new Animated.Value(0),

            animateForwards: true,
        };
    }

    _start() {
        this.setState(
            { animateForwards: true},
            () => this._runAnimation(1)
        );
    }

    _startBackward() {
        this.setState(
            { animateForwards: false},
            () => this._runAnimation(0)
        );
    }

    _runAnimation(to) {
        const animationSettings = {
            toValue: to,
            duration: 1000,
            easing: Easing.out(Easing.quad),
        };

        const jsAnimation = Animated.timing(
            this.state.jsVal,
            animationSettings,
        );

        const nativeAnimation = Animated.timing(
            this.state.nativeVal,
            {
                ...animationSettings,
                useNativeDriver: true,
            },
        );

        Animated.parallel([jsAnimation, nativeAnimation]).start();
    }

    componentWillReceiveProps(newProps: Props) {
        if (this.props.animate != newProps.animate) {
            if(newProps.animate) {
                this._start();
            } else {
                this._startBackward();
            }
        }
    }

    _getTransitions() {
        if (this.state.animateForwards) {
            return this._getForwardTransitions();
        } else {
            return this._getBackwardTransitions();
        }
    }

    _getForwardTransitions() {

        const smallButtonTransition = {
            opacity: this.state.nativeVal.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [1, 0, 0],
            }),

            transform: [{
                scaleX: this.state.nativeVal.interpolate({
                    inputRange: [0, 0.05, 1,],
                    outputRange: [1, 0.9, 1],
                }),
            }, {
                scaleY: this.state.nativeVal.interpolate({
                    inputRange: [0, 0.5, 1,],
                    outputRange: [1, 2, 2],
                }),
            }, {
                translateY: this.state.nativeVal.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -75],
                }),
            }],
        };

        const heroButtonTransition = {
            opacity: this.state.nativeVal.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
            }),

            transform: [{
                translateY: this.state.nativeVal.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-200, -200],
                }),
            }],
        };

        return { smallButtonTransition, heroButtonTransition };
    }

    _getBackwardTransitions() {

        const smallButtonTransition = {
            opacity: this.state.nativeVal.interpolate({
                inputRange: [0, 0.9],
                outputRange: [1, 0],
            }),

            transform: [{
                scaleY: this.state.nativeVal.interpolate({
                    inputRange: [0, 0.4, 1,],
                    outputRange: [1, 1, 2],
                }),
            }, {
                translateY: this.state.nativeVal.interpolate({
                    inputRange: [0, 0.4, 1],
                    outputRange: [0, 0, -75],
                }),
            }],
        };

        const heroButtonTransition = {
            opacity: this.state.nativeVal.interpolate({
                inputRange: [0, 0.8, 1],
                outputRange: [0, 0, 1],
            }),

            transform: [{
                translateY: -200,
                /*
                translateY: this.state.nativeVal.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -200],
                }),
            }, {
                scaleY: this.state.nativeVal.interpolate({
                    inputRange: [0, 0.5, 1,],
                    outputRange: [0, 0, 1],
                }),
                */
            }],
        };

        return { smallButtonTransition, heroButtonTransition };
    }

    render() {
        const { title, onPress, style } = this.props;

        const { smallButtonTransition, heroButtonTransition } = this._getTransitions();

        return <View>
            <Animated.View style={[styles.animationView, style, smallButtonTransition]}>
                <TouchableOpacity onPress={onPress}>
                    <StandardText style={styles.text}>{title}</StandardText>
                </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[styles.largeAnimationView, style, heroButtonTransition]}>
                <TouchableOpacity onPress={onPress}>
                    <StandardText style={styles.largeText}>{title}</StandardText>
                </TouchableOpacity>
            </Animated.View>
        </View>
    }
}

const styles = {
    animationView: {
        backgroundColor: constants.hilightColor2,
        borderRadius: constants.mediumRadius,
    },
    largeAnimationView: {
        backgroundColor: constants.hilightColor2,
        borderRadius: constants.mediumRadius,
    },
    text: {
        textAlign: 'center',
        padding: constants.space(),
    },
    largeText: {
        fontSize: 26,
        textAlign: 'center',
        padding: constants.space(3),
    },
    space: {
        height: constants.space(),
    },
};
