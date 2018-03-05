// @flow

import React from 'react';
import { View, Animated, Easing } from 'react-native';
import { constants } from '../styles/constants.js';

type State = {
    animatedValue: Animated.Value,
};
const circleBorderWidth = 2;
const circleDiameter = 101;
const ballDiameter = 11;
export class Spinner extends React.Component<{}, State> {

    constructor() {
        super();

        const drop = new Animated.Value(-circleDiameter/2 + 2 * circleBorderWidth);
        this.state = {
            drop,
            circleAnim: this.createCircleAnimation(),

            activeYValue: drop,
        };
    }

    createCircleAnimation() {
        const animatedValue = new Animated.Value(0);

        const ballRadius = ballDiameter/2;
        const snapshot = 100;
        const radius = circleDiameter/2 - ballRadius;

        const inputRange = [];
        const xOutputRange = [], yOutputRange = [];

        for (let lap=0; lap < 7; lap++) {
            for (let i=0; i<=snapshot; ++i) {
                const value = i/snapshot + lap;
                const xMove = Math.sin(value * Math.PI * 2) * radius;
                const yMove = -Math.cos(value * Math.PI * 2) * radius;

                inputRange.push(value);
                xOutputRange.push(xMove);
                yOutputRange.push(yMove);
            }
        }
        const translateX = animatedValue.interpolate({ inputRange, outputRange: xOutputRange });
        const translateY = animatedValue.interpolate({ inputRange, outputRange: yOutputRange });

        return {
            animatedValue,
            x: translateX,
            y: translateY,
        };
    }

    componentDidMount() {
        this.start();
    }

    start() {
        const onDropAnimationDone =  () => {
            this.setState(s => ({
                activeYValue: s.circleAnim.y,
            }), () => {
                this.createSpinningAnimation().start();
            });
        };

        this.setState(s => ({
            activeYValue: s.drop,
        }), () => this.createDropAnimation().start(onDropAnimationDone));

        //onDropAnimationDone();
    }

    createSpinningAnimation() {
        const { circleAnim } = this.state;
        circleAnim.animatedValue.setValue(0)

        return Animated.timing(circleAnim.animatedValue, {
            toValue: 7,
            duration: 7000,
            useNativeDriver: true,
            easing: Easing.easeInOut,
        });
    }

    createDropAnimation() {
        const start = -circleDiameter/2 + 2 * circleBorderWidth;
        this.state.drop.setValue(start);
        return Animated.timing(
            this.state.drop,
            {
                toValue: circleDiameter - ballDiameter + start,
                duration: 1000,
                easing: Easing.bounce,
                useNativeDriver: true,
            },
        );
    }

    render() {
        const { circleAnim, activeYValue } = this.state;
        const transform = [{ translateY: activeYValue }, {translateX: circleAnim.x}];

        const realDiam = circleDiameter + 2 * circleBorderWidth;
        return <View
            style={{
                margin: 40,
                width: realDiam,
                height: realDiam,

                backgroundColor: constants.transparent,
                borderWidth: circleBorderWidth,
                borderColor: constants.primaryColor,
                borderRadius: circleDiameter / 2,
            }}>

            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>

                <Animated.View
                    style={{
                        width: ballDiameter,
                        height: ballDiameter,
                        borderRadius: ballDiameter / 2,
                        transform: transform,
                        backgroundColor: constants.primaryColor,
                    }}/>
            </View>
        </View>
    }
}
