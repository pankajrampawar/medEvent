import connectToDatabse from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
    await connectToDatabse();
    console.log("Adding user to db")

    try {
        const userInfo = await req.json();
        const newUser = new User(userInfo);
        await newUser.save();
        return Response.json({ message: "User Added Successfully", user: newUser }, { status: 200 });
    } catch (error) {
        console.log(error.message)
        return Response.json({ error: error.message }, { status: 500 });
    }
}