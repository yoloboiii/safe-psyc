// @flow
// Taken from https://github.com/franfran/react-native-snap-slider

import React from 'react';
import { StyleSheet, Slider, Text, View } from 'react-native';

type Props = {
    onSlidingComplete: (Object) => void,
    items: Array<Object>,
    defaultItem: number,

    style: View.propTypes.style,
    containerStyle: View.propTypes.style,
    itemWrapperStyle: View.propTypes.style,
    itemStyle: Text.propTypes.style,

    maximumValue?: number,
}
type State = {
    value: number,

    sliderWidth: number,
    sliderLeft: number,
    sliderRatio: number,

    itemWidths: Array<number>,
    item: number,
    adjustSign: number,

};

export class SnapSlider extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        const sliderRatio = (props.maximumValue || 1) / (props.items.length - 1);
        const value = sliderRatio * props.defaultItem;
        const item = props.defaultItem;

        this.state = {
            sliderRatio: sliderRatio,
            value: value,
            item: item,
            adjustSign: 1,
            itemWidths: [],
            sliderWidth: 0,
            sliderLeft: 0,
        };
    }

    _sliderStyle() {
        return [defaultStyles.slider, {width: this.state.sliderWidth, left: this.state.sliderLeft}, this.props.style];
    }

    _onSlidingCompleteCallback(v) {
        //pad the value to the snap position
        const halfRatio = this.state.sliderRatio / 2;
        let i = 0;
        for (;;) {
            if ((v < this.state.sliderRatio) || (v <= 0)) {
                if (v >= halfRatio) {
                    i++;
                }
                break;
            }
            v = v - this.state.sliderRatio;
            i++;
        }
        let value = this.state.sliderRatio * i;

        //Move the slider
        value = value + (this.state.adjustSign * 0.000001);//enforce UI update
        if (this.state.adjustSign > 0) {
            this.setState({adjustSign: -1});
        } else {
            this.setState({adjustSign: 1});
        }
        this.setState({value: value, item: i}, () => {
            //callback
            this.props.onSlidingComplete(this.props.items[this.state.item]);
        });

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
                    value={this.state.value} />

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


