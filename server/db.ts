import { MongoClient, type Collection } from "mongodb";
import type { RecommendationRunDoc } from "./types";

const mongoUri = process.env.MONGO_URI ?? "mongodb://127.0.0.1:27018";
const dbName = process.env.MONGO_DB_NAME ?? "score_db";

console.log("[mongo] config loaded", { mongoUri, dbName });

let client: MongoClient | null = null;

async function getClient() {
  if (!client) {
    console.log("[mongo] creating client");
    client = new MongoClient(mongoUri);
    await client.connect();
    console.log("[mongo] connected successfully");
  }
  return client;
}

export async function getRecommendationRunsCollection(): Promise<
  Collection<RecommendationRunDoc>
> {
  const mongoClient = await getClient();
  const db = mongoClient.db(dbName);
  console.log("[mongo] using db:", db.databaseName);
  return db.collection<RecommendationRunDoc>("recommendation_runs");
}

export async function ensureMongoIndexes() {
  console.log("[mongo] ensureMongoIndexes start");
  const collection = await getRecommendationRunsCollection();

  await collection.createIndex({ created_at: -1 });
  await collection.createIndex({ "context.occasion": 1, created_at: -1 });
  await collection.createIndex({ "context.style_intent": 1, created_at: -1 });

  console.log("[mongo] ensureMongoIndexes done");
}
