import { MongoClient, type Collection } from "mongodb";
import type { RecommendationRunDoc, WardrobeItemDoc, UserProfileDoc, SavedOutfitDoc } from "./types";

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

export async function getUserProfileCollection(): Promise<
  Collection<UserProfileDoc>
> {
  const mongoClient = await getClient();
  const db = mongoClient.db(dbName);
  return db.collection<UserProfileDoc>("user_profiles");
}

export async function getSavedOutfitsCollection(): Promise<
  Collection<SavedOutfitDoc>
> {
  const mongoClient = await getClient();
  const db = mongoClient.db(dbName);
  return db.collection<SavedOutfitDoc>("saved_outfits");
}

export async function getRecommendationRunsCollection(): Promise<
  Collection<RecommendationRunDoc>
> {
  const mongoClient = await getClient();
  const db = mongoClient.db(dbName);
  console.log("[mongo] using db:", db.databaseName);
  return db.collection<RecommendationRunDoc>("recommendation_runs");
}

export async function getWardrobeCollection(): Promise<
  Collection<WardrobeItemDoc>
> {
  const mongoClient = await getClient();
  const db = mongoClient.db(dbName);
  return db.collection<WardrobeItemDoc>("wardrobe_items");
}

export async function ensureMongoIndexes() {
  console.log("[mongo] ensureMongoIndexes start");
  const runsCollection = await getRecommendationRunsCollection();

  await runsCollection.createIndex({ created_at: -1 });
  await runsCollection.createIndex({ "context.occasion": 1, created_at: -1 });
  await runsCollection.createIndex({ "context.style_intent": 1, created_at: -1 });

  const wardrobeCollection = await getWardrobeCollection();
  await wardrobeCollection.createIndex({ owner_user_id: 1 });
  await wardrobeCollection.createIndex({ "core_info.category": 1 });
  await wardrobeCollection.createIndex({ "status.is_active": 1 });

  console.log("[mongo] ensureMongoIndexes done");
}
