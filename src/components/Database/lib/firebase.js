import firebase from "firebase";

const config = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId
};

const reactConfig = {};
Object.keys(config).map(v => {
  reactConfig[v] = process.env[`REACT_APP_${v}`];
});

if (!firebase.apps.length) {
  firebase.initializeApp(reactConfig);
}

export default firebase;
//module.exports = firebase;
