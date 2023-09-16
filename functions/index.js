/* eslint-disable */

/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
let db = admin.firestore();
db.settings({ timestampsInSnapshots: true });

function getUser(userId) {
  // [START get_document]
  let userRef = db.collection("Users").doc(userId);
  let getDoc = userRef
    .get()
    .then((doc) => {
      if (!doc.exists) {
        console.log("No such document!");
        return 0;
      } else {
        console.log("Document data:", doc.data());
        return doc.data();
      }
    })
    .catch((err) => {
      console.log("Error getting document", err);
    });
  // [END get_document]
  return getDoc;
}

exports.sendNotification = functions.firestore
  .document("Notifications/{id}")
  .onCreate((snapshot, context) => {
    const payload = {
      notification: {
        title: `${snapshot.data().title}`,
        body: `${snapshot.data().body}`,
        icon: "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
        sound: "",
      },
    };

    return admin
      .messaging()
      .sendToDevice(snapshot.data().receiverToken, payload)
      .then((reponse) => {
        return console.log(`A new notification for  =====`);
      });
  });

/* eslint-enable */