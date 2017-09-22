// @flow

import firebase from 'firebase';
// Initialize Firebase
 const firebaseConfig = {
     apiKey: "AIzaSyBi5UdLAheAzbIFQObjQ2-3QJfkWWSTWGc",
     authDomain: "safe-psyc.firebaseapp.com",
     databaseURL: "https://safe-psyc.firebaseio.com",
     projectId: "safe-psyc",
     storageBucket: "safe-psyc.appspot.com",
     messagingSenderId: "1023992322811"
};
export const firebaseApp = firebase.initializeApp(firebaseConfig);
