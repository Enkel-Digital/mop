// Creates a new user account and returns the user document ID
// The documents are not keyed using email as it can change, they are keyed using firestore autogenerated UID
// Store time user account is created in unix seconds (this is the time of the server executing the code)
const createUserAccount = async (userDetails) =>
  require("./fs")
    .collection("users")
    .add({ ...userDetails, createdAt: require("unixseconds")() })
    .then(({ id }) => id);

/**
 * Create account if does not exists and get back customer/user object
 * @param {*} userID
 * @param {*} customer
 * @returns {Customer} Returns back a customer/user data object
 */
const createUserAccountIfDoesNotExist = async (userID, customer) =>
  userID
    ? await require("../utils/getUserAccount").getUserAccount(userID)
    : (await require("../utils/getUserAccount").getUserAccountIfExists(
        customer.number
      )) || { id: await createUserAccount(customer), ...customer };

module.exports = { createUserAccount, createUserAccountIfDoesNotExist };
