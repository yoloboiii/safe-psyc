// @flow

import React from 'react';
import { View, ActivityIndicator } from 'react-native';

type Props = {
    initial: React$Element<*>,
    loading: React$Element<*>,
    success: React$Element<*>,
    failure: React$Element<*>,

    action: Promise<void>,
};

type State = {
    status: 'measuring' | 'initial';
};
export class Loader extends React.Component<Props, State> {

    initial: ?React$Element<*>;
    loading: ?React$Element<*>;
    success: ?React$Element<*>;
    failure: ?React$Element<*>;
    sizes = {};

    constructor() {
        super();
        this.state = {
            status: 'measuring',
        };
    }

    _measure(refName) {
        this[refName].measure( (x, y, width, height, pageX, pageY) => {
            //console.log('a', x, y, width, height, pageX, pageY);
            this._onMeasured(refName, width, height);
        });
    }

    _onMeasured(refName, width, height) {
        this.sizes[refName] = { width, height };

        const hasMeasuredAllComponents = Object.keys(this.sizes).length === 4
        if (hasMeasuredAllComponents) {
            console.log('done measuring');

            this.props.action()
            this.setState({ status: 'initial' });
        }
    }

    render() {
        console.log('rendering' ,this.state);

        const { status } = this.state;
        const { initial, loading, success, failure } = this.props;

        switch (status) {
        case 'measuring':
            return this._measuring();
        case 'initial':
            return initial;
        }

        return <View />
    }

    _measuring() {
        const { initial, loading, success, failure } = this.props;

        return <View>
            <View
                ref={ c => this.initial = c }
                onLayout={this._measure.bind(this, 'initial')}
            >
                { initial }
            </View>

            <View
                ref={ c => this.loading = c }
                onLayout={this._measure.bind(this, 'loading')}
            >
                { loading }
            </View>

            <View
                ref={ c => this.success = c }
                onLayout={this._measure.bind(this, 'success')}
            >
                { success }
            </View>

            <View
                ref={ c => this.failure = c }
                onLayout={this._measure.bind(this, 'failure')}
            >
                { failure }
            </View>
        </View>
    }
}
Loader.defaultProps = {
    loading: ActivityIndicator,
}
