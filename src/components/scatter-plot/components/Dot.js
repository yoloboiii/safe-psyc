import React from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
}
    from 'react-native';

const propTypes = {
    size: PropTypes.number,
    color: PropTypes.string,
    left: PropTypes.number.isRequired,
    bottom: PropTypes.number.isRequired
};

const defaultProps = {
    color: 'red',
    size: 5
};

class Dot extends React.Component {
    render() {
        const { opacity, size, color, left, bottom, label, labelColor } = this.props
        return [
            <View
                key='view'
                style={
                    {
                        width: size,
                        height: size,
                        backgroundColor: color,
                        bottom: bottom - Math.round(size / 2),
                        left: left - Math.round(size / 2),
                        position: 'absolute',
                        borderRadius: size
                    }
                }
            />,
            <Text key='text'
                style={{
                bottom: bottom - Math.round(size / 2),
                left: left + 2,
                position: 'absolute',
                fontSize: 10,
                color: labelColor,
            }}>{label}</Text>

        ];
    }
}

Dot.propTypes = propTypes; Dot.defaultProps = defaultProps;
export default Dot;
