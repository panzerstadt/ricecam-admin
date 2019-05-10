import React, { useState, useEffect } from "react";
import firebase from "./lib/firebase";

// timestamps
import dayjs from "dayjs";
import "dayjs/locale/ja";
dayjs.locale("ja");

export default firebase;

export const logging = (message, callback) => {
  const timestamp = dayjs().format("YYYY-MM-DDTHH:mm:ss:SSS");
  const daystamp = dayjs().format("YYYY-MM-DD");

  firebase
    .firestore()
    .collection("logs")
    .doc(daystamp)
    .collection("logs")
    .doc(timestamp)
    .set({ message: message }, { merge: true })
    .then(v => {
      callback && callback(v);
    })
    .catch(e => console.log("LOGGING ERROR: ", e));
};

export const grabListOfVideoPaths = async day => {
  const daystamp = day
    ? dayjs(day).format("YYYY-MM-DD")
    : dayjs().format("YYYY-MM-DD");

  console.log("grabbing videos from: ", daystamp);

  return await firebase
    .firestore()
    .collection("videoURL")
    .doc(daystamp)
    .collection("urls")
    .orderBy("url")
    .get()
    .then(async querySnapshot => {
      let promises = [];
      let filenames = [];
      console.log(querySnapshot);
      await querySnapshot.forEach(async doc => {
        // here are your DB video filepaths
        const url = doc.data().url;
        filenames.push(url.split("/").slice(-1));
        console.log(url);

        promises.push(
          firebase
            .storage()
            .ref(url)
            .getDownloadURL() // this is an async function
            .catch(e => {
              console.log(e.message);
              if (e.code === "storage/object-not-found")
                return "video not found";
              else return false;
            })
        );
      });

      const srcs = await Promise.all(promises);
      return srcs.map((v, i) => ({
        name: filenames[i][0],
        src: v
      }));
    });
};

// single call
export const pullAppStateFromDB = async () => {
  return await firebase
    .firestore()
    .collection("appState")
    .doc("commands")
    .get()
    .then(doc => {
      return doc.data();
    })
    .catch(e => console.log("REMOTE DB STATE READ ERROR: ", e));
};

export const FireStoreState = ({
  collection = "appState",
  doc = "commands",
  onUpdate
}) => {
  const [dbState, setDBState] = useState({});

  useEffect(() => {
    firebase
      .collection(collection)
      .doc(doc)
      .onSnapshot(snapshot => {
        setDBState(snapshot.data());
      });
    return () => setDBState({});
  }, []);

  useEffect(() => {
    if (onUpdate) onUpdate(dbState);
  }, [dbState]);

  return <p>db state: {JSON.stringify(dbState, null, 2)}</p>;
};
