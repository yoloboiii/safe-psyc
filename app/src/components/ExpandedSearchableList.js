// @flow

import React from 'react';
import { View, TextInput, FlatList } from 'react-native';
import { VerticalSpace } from './VerticalSpace.js';

type Props = {
    data: Array<{ item: string, key: string }>,
    renderRow: (string) => *,
};
type State = {
    searchString: string,
    data: Array<{ item: string, key: string }>,
};
export class ExpandedSearchableList extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            searchString: '',
            data: props.data,
        };
    }

    _onSearch(text) {
        const data = this.props.data.filter(d => d.item.indexOf(text) > -1);
        this.setState({
            searchString: text,
            data: data,
        });
    }

    render() {
        const { renderRow } = this.props;
        const { searchString, data } = this.state;

        return <View>
            <TextInput
                placeholder={ 'search...' }
                onChangeText={ this._onSearch.bind(this) }
                value={ searchString } />

            <VerticalSpace />

            <FlatList
                data={ data }
                renderItem={ renderRow } />
        </View>
    }
}