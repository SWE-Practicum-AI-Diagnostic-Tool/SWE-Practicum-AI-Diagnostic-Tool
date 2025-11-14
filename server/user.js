import { DATABASE, USER_COLLECTION } from './config.js';
import { client } from './mongo.js';

/**
 * Check if a user exists
 * @param {string} userid 
 * @returns {boolean} If the user exists
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
  if (await userExists(userid)) {
    console.log("User already exists:", userid);
    return false;
  }

  // Create a user using the MongoClient
  const collection = client.db(DATABASE).collection(USER_COLLECTION);
  const user = { _id: userid, name: name };
  await collection.insertOne(user);
  
  console.log("User created:", user);
  
  return true
}

async function getUser(userid) {
  // Check if a user exists using the MongoClient
  // const collection = client.db(DATABASE).collection(USER_COLLECTION);
  // const res = await collection.findOne({ _id: userid });
  // return res;
  if(userExists(userid)){
    const collection = client.db(DATABASE).collection(USER_COLLECTION);
    //const res = await collection.findOne({ name: userName });
    const res = await collection.find({ name: userName });
    return res;
  }
  else{
    console.log("User does not exist:", userid);
    return null;
  }

}
