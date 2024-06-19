import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject ={}

export default async function dbConnect(): Promise<void>{
    if(connection.isConnected){
        console.log("Already connected to database")
    }

    try{
        //console log db, db.connection[0]
        const db = await mongoose.connect(process.env.MONGOOSE_URL || '',{})

        connection.isConnected = db.connections[0].readyState
    }
    catch (err)
    {   console.log("database Connection failed",err)
        process.exit(1)
    }
}


