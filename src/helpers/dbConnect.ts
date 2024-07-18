import mongoose from "mongoose";

type Connectionobject = {
  isConnected?: number;
};

const connection: Connectionobject = {};

export async function dbCoonect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_URI || "", {});
    connection.isConnected = 1;
    console.log("Connected to database");
    connection.isConnected = db.connections[0].readyState;
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Database connectin failed", error);
    process.exit(1);
  }
}
