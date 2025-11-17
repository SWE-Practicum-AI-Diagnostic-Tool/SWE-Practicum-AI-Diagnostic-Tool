import { DATABASE, USER_COLLECTION } from './config.js';
import { client } from './mongo.js';

/**
 * Check if a user exists and return it
 * @param {string} userid 
 * @returns {WithId<Document> | null} The user if it exists
 */
export async function getUser(userid) {
  // Check if a user exists using the MongoClient
  const collection = client.db(DATABASE).collection(USER_COLLECTION);
  const res = await collection.findOne({ _id: userid });
  return res;
}

/**
 * Update user information
 * @param {string} userid The user identifier
 * @param {Object} updates The updates
 */
export async function updateUser(userid, updates) {
  const collection = client.db(DATABASE).collection(USER_COLLECTION);
  await collection.updateOne({ _id: userid }, { $set: updates });
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
  const dbUser = await getUser(userid);
  const collection = client.db(DATABASE).collection(USER_COLLECTION);
  const user = { _id: userid, name: name, flowcharts: [], email: "", attitude: "", crashOut: 0 };

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
 * Save a flowchart for a user (up to 5)
 * @param {string} userid The user identifier
 * @param {string} flowchart The json string of the flowchart
 * @param {Object} vehicle Vehicle object
 * @param {string} issues Vehicle issue description
 * @param {Array<Object>} responses User responses
 */
export async function saveFlowchart(userid, flowchart, vehicle, issues, responses) {
  const collection = client.db(DATABASE).collection(USER_COLLECTION);
  const MAX_FLOWCHARTS = 5;

  const res = await collection.findOne({ _id: userid });
  if (res.flowcharts.length >= MAX_FLOWCHARTS) {
    res.flowcharts.shift();
  }
  res.flowcharts.push({
    flowchart, vehicle, issues, responses
  });
  await collection.updateOne({ _id: userid }, { $set: res });
}

/**
 * Get all flowcharts for a user
 * @param {string} userid The user identifier
 * @returns {Array<string>} The flowcharts
 */
export async function getFlowcharts(userid) {
  const collection = client.db(DATABASE).collection(USER_COLLECTION);
  const res = await collection.findOne({ _id: userid });
  return res.flowcharts;
}
