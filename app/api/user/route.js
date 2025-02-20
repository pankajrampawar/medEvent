import connectToDatabse from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req) {
    await connectToDatabse();

    try {
        const { searchParams } = new URL(req.url);
        const eventId = searchParams.get('id')
        console.log(eventId)
        if (!eventId) {
            console.log("id not found")
            return Response.json({ error: "Id not found" }, { status: 404 });
        }

        const users = await User.find({ eventId });

        if (!users) {
            return Response.json({ error: "Event not found" },)
        }

        return Response.json({ users });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    await connectToDatabse();
    console.log("Adding user to db")

    try {
        const { eventId, firstName, lastName, dateOfBirth, contactNumber, chiefComplaint, hasAllergy, allergyInfo } = await req.json();
        const newUser = new User({
            eventId, firstName, lastName, dateOfBirth, contactNumber, chiefComplaint, ...(hasAllergy && { allergic: allergyInfo })
        });

        await newUser.save();
        return Response.json({ message: "User Added Successfully", user: newUser }, { status: 200 });
    } catch (error) {
        console.log(error.message)
        return Response.json({ error: error.message }, { status: 500 });
    }
}