import { db } from "./db";
import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  username: string;
  password: string;
}

export const usersCollection = db.collection<User>("users");