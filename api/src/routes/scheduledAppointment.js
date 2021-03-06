/**
 * Express Router for handling appointments
 * Mounted on /appointment
 * @author JJ
 * @module take routes
 */

const express = require("express");
const router = express.Router();
const fs = require("../utils/fs");
const { asyncWrap } = require("express-error-middlewares");

/**
 * Creates an account for the user if it does not already exists, and book a appointment
 * @name GET /appointment/scheduled
 * @returns Sucess indicator
 */
router.get(
  "/",
  asyncWrap(async (req, res) => {
    // Appointments timestamps are stored as unix time Milliseconds thus `after` is also in Milliseconds
    // If after is passed in as a query parameter it should be a number with Milliseconds as its unit,
    // Else get 30 minutes before current unix milliseconds timestamp so that current appointment will be included too.
    const after = req.query.after || new Date().getTime() - 1800000;

    // Query DB for appointments that end after a given time
    // https://cloud.google.com/firestore/docs/query-data/queries#limitations
    // Because of the limitations of the != operator, we cannot filter out
    // cancelled appointments directly using the query, thus need to filter out after getting back the document
    // It isn't too bad since there will probably not be so many cancelled appointments within the timeframe
    const snapshot = await fs
      .collection("appointments")
      .where("time", ">=", after)
      .get();

    res.status(200).json({
      // If snapshot is empty, return an empty array, else,
      // Map the array of doc references to an array of doc data and doc ID
      // Filter out cancelled appointments
      // Reduce into a single object keyed by appointment ID
      appointments: snapshot.empty
        ? {}
        : snapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter((doc) => doc.cancelled !== true)
            // Possibly faster implementation?
            // .reduce((acc, curr) => {
            //   acc[curr.id] = curr;
            //   return acc;
            // }, {})
            .reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {}),
    });
  })
);

module.exports = router;
