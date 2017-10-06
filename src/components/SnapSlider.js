// @flow
// Taken from https://github.com/franfran/react-native-snap-slider

import React from 'react';
import { StyleSheet, Slider, Text, View } from 'react-native';

type Props = {
    onSlidingComplete: (Object) => void,
    items: Array<Object>,
    value?: number,

    style: View.propTypes.style,
    containerStyle: View.propTypes.style,
    itemWrapperStyle: View.propTypes.style,
    itemStyle: Text.propTypes.style,
}
type State = {
    sliderWidth: number,
    sliderLeft: number,

    itemWidths: Array<number>,
};

export class SnapSlider extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = this._defaultState(props);
    }

    _defaultState(props: Props) {
        return {
            itemWidths: [],
            sliderWidth: 0,
            sliderLeft: 0,
        };
    }

    _sliderStyle() {
        return [defaultStyles.slider, {width: this.state.sliderWidth, left: this.state.sliderLeft}, this.props.style];
    }

    _onSlidingCompleteCallback(v) {
        this.props.onSlidingComplete(this.props.items[v]);
    }

    _getItemWidth(x) {
        const width = x.nativeEvent.layout.width;
        const itemWidths = this.state.itemWidths;
        itemWidths.push(width);
        this.setState({itemWidths: itemWidths});

        //we have all itemWidths determined, let's update the silder width
        if (this.state.itemWidths.length === this.props.items.length) {
            const max = Math.max.apply(null, this.state.itemWidths);

            if (this.refs.slider && this.state.sliderWidth > 0) {
                const buffer = 30;//add buffer for the slider 'ball' control
                let w = this.state.sliderWidth - max;
                w = w + buffer;

                let l = max / 2;
                l = l - buffer / 2;

                this.setState({
                    sliderWidth: w,
                    sliderLeft: l,
                });
            }
        }
    }

    _getAndSetSliderWidth(e) {
        const {x, y, width, height} = e.nativeEvent.layout;
        this.setState({sliderWidth: width});
    }

    render() {
        const itemStyle = [defaultStyles.item, this.props.itemStyle];
        const labels = this.props.items.map(i => <Text
                key={i.value}
                style={itemStyle}
                onLayout={this._getItemWidth.bind(this)}>{i.label}</Text>
        );

        return <View
                onLayout={ this._getAndSetSliderWidth.bind(this) }
                style={[defaultStyles.container, this.props.containerStyle]}>

                <Slider
                    ref="slider"
                    style={this._sliderStyle()}
                    onSlidingComplete={(value) => this._onSlidingCompleteCallback(value)}
                    minimumValue={0}
                    maximumValue={ this.props.items.length - 1 }
                    step={1}
                    value={ this.props.value }
                    />

                <View style={[defaultStyles.itemWrapper, this.props.itemWrapperStyle]}>
                    { labels }
                </View>
        </View>
    }
}

const defaultStyles = StyleSheet.create({
    container: {
        alignSelf: 'stretch',
    },
    slider: {
    },
    itemWrapper: {
        justifyContent: 'space-between',
        alignSelf: 'stretch',
        flexDirection: 'row',
    },
    item: {
    },
});


