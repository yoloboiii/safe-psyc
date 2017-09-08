// @flow

import React from 'react';
import { View, Button } from 'react-native';

type Props = {
    navigation: {
        navigate: (string, Object) => void,
    },
}
export class HomeScreen extends React.Component<Props, {}> {
    static navigationOptions = {
        title: 'A LA MAISON',
    };

    render() {
        return <View>
            <Button
                title='Start random session'
                onPress={ () => startRandomSession(this.props.navigation.navigate) }
            />
        </View>
    }
}

function startRandomSession(navigate) {

    navigate('Session', {
        questions: [],
        hej: 'HALLO',
    });
}
