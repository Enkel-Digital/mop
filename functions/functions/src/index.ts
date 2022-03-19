/*
  Might migrate to gen2 cloud functions in the future
  https://cloud.google.com/functions/docs/2nd-gen/2nd-gen-differences
*/

import * as functions from "firebase-functions";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { request } from "https";
import type { https } from "firebase-functions";

initializeApp();

/**
 * verifyRecaptcha function resolves if recaptcha token is valid,
 * else it rejects with an Error
 */
const verifyRecaptcha = async ({ headers, socket }: https.Request) =>
  new Promise((resolve, reject) => {
    // Get the recaptcha token passed in as a header, note that headers are all lowercased by express
    const token = headers["x-recaptcha-token"];
    if (!token) return reject(new Error("Missing recaptcha token"));

    const req = request(
      {
        protocol: "https:",
        host: "www.google.com",
        method: "POST",

        path: `/recaptcha/api/siteverify?secret=${
          process.env.recaptchaSecret
        }&response=${token}&remoteip=${
          headers["x-forwarded-for"] || socket.remoteAddress
        }`,
      },
      (res) => {
        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error(`Recaptcha API failed: ${res.statusCode}`));
        }

        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("close", () => {
          const resp = JSON.parse(data);

          if (!resp.success) return reject(new Error(resp["error-codes"]));
          if (resp.score < 0.7)
            return reject(new Error(`Recaptcha score too low: ${resp.score}`));

          return resolve(resp);
        });
      }
    );

    req.on("error", reject);
    req.end();
  });

export const getDogs = functions
  /* Run function in Singapore only */
  .region("asia-southeast1")
  /* Modify the runtime constraints and behaviour of the cloud function */
  .runWith({
    // Default timeout of firebase function is 60 seconds
    // However this function does not need that long since it is just a FS call
    // Thus reducing timeout to ensure that it will not accidentally run too long
    timeoutSeconds: 10,

    // To prevent cost from exceeding
    // However this becomes vulnerable to DDoS, but at least DB wont get hit with recaptcha protection
    maxInstances: 20,
  })
  .https.onRequest((_, r) => {
    r.set({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
    });
    getFirestore()
      .collection("dogs")
      .where("show", "==", true)
      .get()
      .then(({ docs }) => docs.map((doc) => doc.data()))
      .then((dogs) => r.status(200).json({ dogs }))
      .catch((_: Error) => r.status(500).json({ error: "Failed" }));
  });