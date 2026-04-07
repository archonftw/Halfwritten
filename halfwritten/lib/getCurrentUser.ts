import DBconnect from "./db";
import User from "@/models/user";

export async function getCurrentUser(clerkId:string){
    await DBconnect();

    const user = await User.findOne({clerkId});
    return user;
}