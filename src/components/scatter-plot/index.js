import React from 'react';
import PropTypes from 'prop-types';

import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions
}
    from 'react-native';

import Dot from './components/Dot';
import HorizontalLine from './components/HorizontalLine';


const propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            color: PropTypes.string,
            unit: PropTypes.string,
            values: PropTypes.arrayOf(
                PropTypes.shape({
                    x: PropTypes.number,
                    y: PropTypes.number,
                })
            )

        })
    ), // takes array of series of data (array of arrays of {x, y})
    chartWidth: PropTypes.number, // by default uses entire width of the device
    chartHeight: PropTypes.number, // by default 200 scaled px
    backgroundColor: PropTypes.string, // 'white' by default
    colors: PropTypes.arrayOf(PropTypes.string), // specify the colors for each series of data
    minY: PropTypes.number,
    maxY: PropTypes.number,
    minX: PropTypes.number,
    maxX: PropTypes.number,
    unitX: PropTypes.string,
    unitY: PropTypes.string,
    horizontalLinesAt: PropTypes.arrayOf(PropTypes.number),
    verticalLinesAt: PropTypes.arrayOf(PropTypes.number),
}
const defaultProps = {
    chartHeight: 200,
    chartWidth: Dimensions.get('window').width,
    backgroundColor: 'white'
}

export class ScatterChart extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            ratioX: undefined,
            ratioY: undefined,
            minX: undefined,
            maxX: undefined,
            minY: undefined,
            maxY: undefined,
            horizontalLinesAt: undefined
        };
    }
    render() {
        const { data, chartHeight, chartWidth, backgroundColor, colors, unitX, unitY } = this.props;

        const { minY, maxY, minX, maxX, horizontalLinesAt, verticalLinesAt } = this.state;

        const { getX, getY } = this;

        const windowHeight = Dimensions.get('window').height, windowWidth = Dimensions.get('window').width;

        const horizontalLines = horizontalLinesAt ? horizontalLinesAt.map((line, idx) => <HorizontalLine key={idx} bottom={getY(line)} width={chartWidth} displayText={`${line} ${unitY}`} />) : undefined;

        const verticalLines = verticalLinesAt ? verticalLinesAt.map((line, idx) => <View key={idx} style={{ opacity: .5, backgroundColor: 'gray', width: 1, height: chartHeight, bottom: 0, left: getX(line), position: 'absolute' }} />) : undefined;

        let points = [];
        if (data) {
            for (let i = 0; i < data.length; i++) {
                const dataSeries = data[i];
                for (let j = 0; j < dataSeries.values.length; j++) {
                    const point = dataSeries.values[j];
                    const left   = getX(point.x)
                    const bottom = getY(point.y)

                    points.push(<Dot
                        key={`${i}_${j}`}
                        left={left}
                        bottom={bottom}
                        color={dataSeries.color}
                        label={point.label}
                        labelColor={point.labelColor || dataSeries.color}
                        />)
                }
            }
        }

        return (
            <View style={{ height: chartHeight, backgroundColor: backgroundColor }}>
                {points}
                {horizontalLines}
                {verticalLines}
            </View>
        );
    }
    componentWillReceiveProps(nextProps) {
        this.computeAxes(nextProps);
    }
    componentWillMount() {
        this.computeAxes(this.props);
    }
    computeAxes = async (props) => {
        const { data, minX, minY, maxX, maxY, chartWidth, chartHeight } = props;
        let { horizontalLinesAt, verticalLinesAt } = props;
        if (!data) { return; }
        // let minXData = data[0][0].x, maxXData = data[0][0].x, minYData = data[0][0].y, maxYData = data[0][0].y; // minimum extracted from data
        let seriesMinX = [], seriesMaxX = [], seriesMinY = [], seriesMaxY = [];
        data.forEach(dataSeries => {
            const xArr = dataSeries.values.map(point => point.x);
            seriesMinX.push(Math.min.apply(null, xArr));
            seriesMaxX.push(Math.max.apply(null, xArr));
            const yArr = dataSeries.values.map(point => point.y);
            seriesMinY.push(Math.min.apply(null, yArr));
            seriesMaxY.push(Math.max.apply(null, yArr));
        });
        const _minX = typeof minX !== 'undefined' ? Math.min.apply(null, [minX, ...seriesMinX]) : Math.min.apply(null, seriesMinX);
        const _maxX = typeof maxX !== 'undefined' ? Math.max.apply(null, [maxX, ...seriesMaxX]) : Math.max.apply(null, seriesMaxX);
        const _minY = typeof minY !== 'undefined' ? Math.min.apply(null, [minY, ...seriesMinY]) : Math.min.apply(null, seriesMinY);
        const _maxY = typeof maxY !== 'undefined' ? Math.max.apply(null, [maxY, ...seriesMaxY]) : Math.max.apply(null, seriesMaxY);

        horizontalLinesAt || (horizontalLinesAt = []);
        const _horizontalLinesAt = [];
        for (let i = 0; i < horizontalLinesAt.length; i++) {
            const current = horizontalLinesAt[i];
            if (current >= _minY && current <= _maxY) { _horizontalLinesAt.push(current) }
        }
        horizontalLinesAt = [..._horizontalLinesAt];
        // if (horizontalLinesAt.indexOf(minY) === -1) { horizontalLinesAt = [minY, ...horizontalLinesAt]; }
        // if (horizontalLinesAt.indexOf(maxY) === -1) { horizontalLinesAt = [...horizontalLinesAt, maxY]; }

        await this.setState({
            minX: _minX,
            maxX: _maxX,
            minY: _minY,
            maxY: _maxY,
            ratioX: chartWidth / (_maxX - _minX),
            ratioY: chartHeight / (_maxY - _minY),
            horizontalLinesAt,
            verticalLinesAt
        });
    }
    getX = v => {
        const { minX, ratioX } = this.state;
        return (v - minX) * ratioX;
    }
    getY = v => {
        const { minY, ratioY } = this.state;
        return (v - minY) * ratioY;
    }
}
ScatterChart.propTypes = propTypes;
ScatterChart.defaultProps = defaultProps
