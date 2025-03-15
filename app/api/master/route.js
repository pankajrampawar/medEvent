import connectToDatabse from "@/lib/mongodb";
import Master from "@/models/Master"; // Ensure correct import

export async function GET(req) {
    try {
        // Connect to the database
        await connectToDatabse();
        console.log("Connected to database");

        // Extract query parameters
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (id) {
            // Fetch a single master by ID
            const master = await Master.findById(id);
            if (!master) {
                return Response.json({ error: "Master not found" }, { status: 404 });
            }
            console.log("Fetched master by ID successfully");
            return Response.json({ master });
        } else {
            // Fetch all masters
            const masters = await Master.find({});
            console.log("Fetched all masters successfully");
            return Response.json({ masters });
        }
    } catch (error) {
        console.error("Error fetching masters:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}


export async function POST(req) {
    console.log("Running POST request");

    try {
        // Connect to the database
        await connectToDatabse();
        console.log("Connected to database");

        // Parse the request body
        const { name, extraItems, excludedItems } = await req.json();
        console.log("Received data:", { name, extraItems, excludedItems });

        // Validate required fields
        if (!name) {
            return Response.json({ error: "Name is required" }, { status: 400 });
        }

        // Check for duplicate master names (if applicable)
        const existingMaster = await Master.findOne({ name });
        if (existingMaster) {
            return Response.json({ error: "Master with this name already exists" }, { status: 409 });
        }

        // Create and save the new master
        const newMaster = new Master({ name, extraItems, excludedItems });
        await newMaster.save();
        console.log("Master created successfully:", newMaster);

        // Return success response
        return Response.json({ message: "Master created successfully", master: newMaster }, { status: 201 });
    } catch (error) {
        console.error("Error creating master:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    console.log("Running PUT request");

    try {
        // Connect to the database
        await connectToDatabse();
        console.log("Connected to database");

        // Parse the request body
        const { id, name, extraItems, excludedItems } = await req.json();
        console.log("Received data:", { id, name, extraItems, excludedItems });

        // Validate required fields
        if (!id) {
            return Response.json({ error: "ID is required" }, { status: 400 });
        }

        // Find the existing master by ID
        const existingMaster = await Master.findById(id);
        if (!existingMaster) {
            return Response.json({ error: "Master not found" }, { status: 404 });
        }

        // Update the master's fields
        if (name) existingMaster.name = name;
        if (extraItems) existingMaster.extraItems = extraItems;
        if (excludedItems) existingMaster.excludedItems = excludedItems;

        // Save the updated master
        await existingMaster.save();
        console.log("Master updated successfully:", existingMaster);

        // Return success response
        return Response.json({ message: "Master updated successfully", master: existingMaster }, { status: 200 });
    } catch (error) {
        console.error("Error updating master:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}


export async function DELETE(req, { params }) {
    console.log("Running DELETE request");

    try {
        // Connect to the database
        await connectToDatabse();
        console.log("Connected to database");

        // Extract the master ID from the URL parameters
        const { id } = params;
        console.log("Deleting master with ID:", id);

        // Validate the ID
        if (!id) {
            return Response.json({ error: "Master ID is required" }, { status: 400 });
        }

        // Find and delete the master
        const deletedMaster = await Master.findByIdAndDelete(id);

        // Check if the master was found and deleted
        if (!deletedMaster) {
            return Response.json({ error: "Master not found" }, { status: 404 });
        }

        // Return success response
        console.log("Master deleted successfully:", deletedMaster);
        return Response.json({ message: "Master deleted successfully", master: deletedMaster }, { status: 200 });
    } catch (error) {
        console.error("Error deleting master:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}