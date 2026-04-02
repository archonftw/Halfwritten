import mongoose from "mongoose";

const MONGODB_URI:any = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let isConnected = false;

async function DBconnect(): Promise<void> {

    if(isConnected){
        console.log("Database already connected")
    }

  try {
    if (isConnected) {
      console.log("Database already connected");
      return;
    }

    const db = await mongoose.connect(MONGODB_URI);

    isConnected = db.connections[0].readyState === 1;

    console.log("Connected to Database");
  } catch (error) {
    console.log("Failed connection to Database", error);
    throw error;
  }
}

export default DBconnect;