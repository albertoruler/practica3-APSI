import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

export let db: Db;

export const connectToDB = async () => {
  await client.connect();
  db = client.db("comicvault");
};