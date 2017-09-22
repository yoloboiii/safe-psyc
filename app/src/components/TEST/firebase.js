// @flow

import React from 'react';
import { View, Button, Alert } from 'react-native';
import { backendFacade } from '../../services/backend.js';

import firebase from 'firebase';
import { firebaseApp } from '../../services/firebase.js';

export function Firebase(props) {
    return <View>
        <Button onPress={ createUser } title={'Create user'} />
        <Button onPress={ login } title={'Login'} />
        <Button onPress={ regAns } title={'Register correct answer'} />
        <Button onPress={ readAns } title={'READ DATA'} />
    </View>
}

function createUser() {
    const email = 'apaa@larko.se';
    const password = '123456';

    backendFacade.createNewUser(email, password)
        .then( () => {
            Alert.alert('USAR KRIIAITED' ,'');
        })
        .catch(function(error) {
           Alert.alert('CREATE USER ERROR', '' + error);
        });
}

function login() {
    const email = 'apaa@larko.se';
    const password = '123456';

    backendFacade.login(email, password)
        .then( function() {
            Alert.alert('LOGGED IN', JSON.stringify(arguments));
        })
        .catch(function(error) {
            Alert.alert('LOGIN FAILURE', ''+ error);
        });
}

let signedinuser = null;
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // user is signed in.
        signedinuser = user;
        Alert.alert('user signed in!', '');
    } else {
        // user is signed out.
        signedinuser = null;
    }
});

function regAns() {
    const q = {
        id: 1,
        type: 'eye-question',
        image: 'LIMAGE',
        answer: 'ans',
    };

    backendFacade.registerCorrectAnswer(q)
        .then( () => {
            Alert.alert('STORED!');
        })
        .catch(e => {
            Alert.alert('Not stored', '' + e);
        });
}

function readAns() {
    firebase.database().ref("correct-question-answers/"+signedInUser.uid).on('value', (snap) => {
        Alert.alert('READ THE DATA', '' + JSON.stringify(snap.val()));
    });
}
