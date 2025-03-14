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
        const { eventId, firstName, lastName, dateOfBirth, contactNumber, chiefComplaint, hasAllergy, allergyInfo, hasAgreed } = await req.json();
        const newUser = new User({
            eventId, firstName, lastName, hasAgreed, dateOfBirth, contactNumber, chiefComplaint, ...(hasAllergy && { allergic: allergyInfo })
        });

        await newUser.save();
        return Response.json({ message: "User Added Successfully", user: newUser }, { status: 200 });
    } catch (error) {
        console.log(error.message)
        return Response.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    await connectToDatabse();
    console.log("Updating user in the database");

    try {
        const requestBody = await req.json();
        const { userId, ...updateData } = requestBody; // Extract userId and the rest of the fields

        // Dynamically build the $set object
        const updateFields = {};
        for (const [key, value] of Object.entries(updateData)) {
            if (value !== undefined && value !== null) { // Only include fields that are not undefined or null
                updateFields[key] = value;
            }
        }

        // If no valid fields are provided to update, return an error
        if (Object.keys(updateFields).length === 0) {
            return Response.json({ error: "No valid fields provided for update" }, { status: 400 });
        }

        // Find the user by ID and update the fields
        const updatedUser = await User.findByIdAndUpdate(
            userId, // Assuming `userId` is the unique identifier for the user
            { $set: updateFields }, // Use the dynamically built updateFields object
            { new: true } // This returns the updated document
        );

        if (!updatedUser) {
            return Response.json({ error: "User not found" }, { status: 404 });
        }

        console.log(updatedUser);
        return Response.json({ message: "User updated successfully", user: updatedUser }, { status: 200 });
    } catch (error) {
        console.error(error.message);
        return Response.json({ error: error.message }, { status: 500 });
    }
}