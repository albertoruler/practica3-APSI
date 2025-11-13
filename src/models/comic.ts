import { db } from "./db";
import { ObjectId } from "mongodb";

export interface Comic {
  _id?: ObjectId;
  title: string;
  author: string;
  year: number;
  publisher?: string;
  userId: ObjectId;
  status?: "pendiente" | "leído";
}

export const createComic = async (comic: Comic) => {
  const comicsCollection = db.collection<Comic>("comics");
  return await comicsCollection.insertOne(comic);
};

export const getComicsByUser = async (userId: ObjectId) => {
  const comicsCollection = db.collection<Comic>("comics");
  return await comicsCollection.find({ userId }).toArray();
};

export const getComicById = async (id: string, userId: ObjectId) => {
  const comicsCollection = db.collection<Comic>("comics");
  return await comicsCollection.findOne({ _id: new ObjectId(id), userId });
};

export const updateComic = async (id: string, userId: ObjectId, data: Partial<Comic>) => {
  const comicsCollection = db.collection<Comic>("comics");
  return await comicsCollection.updateOne({ _id: new ObjectId(id), userId }, { $set: data });
};

export const deleteComic = async (id: string, userId: ObjectId) => {
  const comicsCollection = db.collection<Comic>("comics");
  return await comicsCollection.deleteOne({ _id: new ObjectId(id), userId });
};