import { DATABASE, USER_COLLECTION } from './config.js';
import { client } from './mongo.js';

/**
 * Check if a user exists
 * @param {string} userid 
 * @returns {WithId<Document> | null} If the user exists
 */
async function userExists(userid) {
  // Check if a user exists using the MongoClient
  const collection = client.db(DATABASE).collection(USER_COLLECTION);
  const res = await collection.findOne({ _id: userid });
  return res;
}

/**
 * Get user data from auth0
 * @param {string} authorization The auth0 authorization Bearer + token
 * @returns User object
 */
export async function getUserData(authorization) {
  const response = await fetch(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
    headers: { authorization },
  });
  return await response.json();
}

/**
 * Attempt to create a user
 * @param {string} userid The user identifier
 * @param {string} name The users full name
 * @returns Whether the user account was created or not
 */
export async function createUser(userid, name) {
  const dbUser = await userExists(userid);
  const collection = client.db(DATABASE).collection(USER_COLLECTION);
  const user = { _id: userid, name: name, flowcharts: [] };

  if (!dbUser) {
    // Create a user using the MongoClient
    await collection.insertOne(user);
    console.log("User created:", user);
    return "User created";
  }

  // Check for missing fields
  let updated = false;
  for (const field in user) {
    if (!dbUser.hasOwnProperty(field)) {
      dbUser[field] = user[field];
      updated = true;
    }
  }

  if (updated) {
    // Update the user using the MongoClient
    const collection = client.db(DATABASE).collection(USER_COLLECTION);
    await collection.updateOne({ _id: userid }, { $set: dbUser });
    console.log("User updated:", dbUser);
    return "User updated";
  } else {
    // User already exists
    console.log("User already exists:", userid);
    return "User already exists";
  }
}

/**
 * Save a flowchart for a user
 * @param {string} userid The user identifier
 * @param {string} flowchart The json string of the flowchart
 */
export async function saveFlowchart(userid, flowchart) {
  const collection = client.db(DATABASE).collection(USER_COLLECTION);
  await collection.updateOne({ _id: userid }, { $push: { flowcharts: flowchart } });
}
