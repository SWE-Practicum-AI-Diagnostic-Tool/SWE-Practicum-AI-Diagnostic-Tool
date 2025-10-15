import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = "mongodb+srv://Alek_db_user:Thisisaverysecurepassword1!@ai-diagnostic-tool-proj.njtobnl.mongodb.net/?retryWrites=true&w=majority&appName=AI-Diagnostic-Tool-Project"; // Keep the one that already worked

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const db = client.db("sample_mflix");           // <— your database
    const collection = db.collection("movies");     // <— pick any collection

    // Fetch first 5 movies
    const movies = await collection.find().limit(5).toArray();

    console.log("🎬 Sample Movies:");
    console.log(movies);

  } catch (error) {
    console.error("❌ Error reading data:", error);
  } finally {
    await client.close();
  }
}

run();
