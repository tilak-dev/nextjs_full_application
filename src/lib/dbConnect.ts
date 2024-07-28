import mongoose from "mongoose";

type ConnectObject = {
  isConnected?: number;
  
};

const connection: ConnectObject = {};

async function dbConnect():Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected database")
    return
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_URI || '',{})
    console.log(db)

    connection.isConnected = db.connections[0].readyState
    console.log(connection.isConnected);
    
    console.log("db is connected sucess fully ")
  } catch (error:any) {
    console.log("db falied to connect",error)
    process.exit(1)
  }
} 

export default dbConnect
