import dotenv from 'dotenv';
import { MongoClient } from "mongodb";

// const MONGODB_URI = process.env.MONGODB_URI;

const MONGODB_URI = ""
const dbName = "memories";
const collName = "documents";
const indexName = "vector_index_test1"; // or your custom name

const queryVector = Array.from({ length: 768 }, () => Math.random());

async function run() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const coll = client.db(dbName).collection(collName);

    const cursor = coll.aggregate([
      {
        $vectorSearch: {
          index: indexName,
          path: "embedding",
          queryVector,
          numCandidates: 100,
          limit: 5
        }
      },
      {
        $project: {
          title: 1,
          text: 1,
          score: { $meta: "vectorSearchScore" }
        }
      }
    ]);

    const results = await cursor.toArray();
    console.log(results);
  } finally {
    await client.close();
  }
}

run().catch(console.error);