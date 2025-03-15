import connectToDatabse from "@/lib/mongodb";
import Item from "@/models/Item";

export async function GET() {
    await connectToDatabse();
    try {
        const items = await Item.find({});
        return Response.json({ items });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}


export async function POST(req) {
    await connectToDatabse();

    try {
        console.log("adding item")
        const { name, status } = await req.json();
        let newItem;
        if (status) {
            newItem = new Item({ name });
        } else {
            newItem = new Item({ name, extra: true });
        }
        await newItem.save();
        return Response.json({ message: "Item created successfully", item: newItem }, { status: 200 });
    } catch (error) {
        console.log(error.message);
        return Response.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    await connectToDatabse();

    try {
        console.log("Updating item");
        const { id } = await req.json(); // Extract the item ID from the request body

        // Validate the ID
        if (!id) {
            return Response.json({ error: "Item ID is required" }, { status: 400 });
        }

        // Find the item by ID and update its `extra` field to `false`
        const updatedItem = await Item.findByIdAndUpdate(
            id, // Find the item by ID
            { extra: false }, // Update the `extra` field
            { new: true } // Return the updated document
        );

        // Check if the item was found and updated
        if (!updatedItem) {
            return Response.json({ error: "Item not found" }, { status: 404 });
        }

        // Return the updated item
        return Response.json({ message: "Item updated successfully", item: updatedItem }, { status: 200 });
    } catch (error) {
        console.error("Error updating item:", error.message);
        return Response.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    await connectToDatabse();

    try {
        console.log("Deleting item");
        const { id } = await req.json(); // Extract the item ID from the request body

        // Validate the ID
        if (!id) {
            return Response.json({ error: "Item ID is required" }, { status: 400 });
        }

        // Find the item by ID and delete it
        const deletedItem = await Item.findByIdAndDelete(id);

        // Check if the item was found and deleted
        if (!deletedItem) {
            return Response.json({ error: "Item not found" }, { status: 404 });
        }

        // Return success response
        return Response.json({ message: "Item deleted successfully", item: deletedItem }, { status: 200 });
    } catch (error) {
        console.error("Error deleting item:", error.message);
        return Response.json({ error: error.message }, { status: 500 });
    }
}