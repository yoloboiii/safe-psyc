// @flow

import React from 'react';
import { View, Button, Alert } from 'react-native';
import { backendFacade } from '../../services/backend.js';

import firebase from 'firebase';
import { firebaseApp } from '../../services/firebase.js';

export function Firebase(props) {
    return <View>
        <Button onPress={ createUser } title={'b Create user'} />
        <Button onPress={ login } title={'Login'} />
        <Button onPress={ regAns } title={'Register correct answer'} />
        <Button onPress={ readAns } title={'READ DATA'} />
    </View>
}

function createUser() {
    const email = 'apa@larko.se';
    const password = '123456';

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then( () => {
            Alert.alert('USAR KRIIAITED' ,'');
        })
        .catch(function(error) {
           Alert.alert('CREATE USER ERROR', '' + error);
        });
}

function login() {
    const email = 'apa@larko.se';
    const password = '123456';

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then( function() {
            Alert.alert('LOGGED IN', JSON.stringify(arguments));
        })
        .catch(function(error) {
            Alert.alert('LOGIN FAILURE', ''+ error);
        });
}

let signedInUser = null;
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        signedInUser = user;
        Alert.alert('User signed in!', '');
    } else {
        // User is signed out.
        signedInUser = null;
    }
});

function regAns() {

    firebase.database().ref("correct-question-answers/"+signedInUser.uid).push({ question: 1 }, (e) => {
        Alert.alert('STORED MAYHAPS', '' + e);
    });
}

function readAns() {
    firebase.database().ref("correct-question-answers/"+signedInUser.uid).on('value', (snap) => {
        Alert.alert('READ THE DATA', '' + JSON.stringify(snap.val()));
    });
}
