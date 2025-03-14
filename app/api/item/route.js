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
        const { name } = await req.json();
        const newItem = new Item({ name, extra: true });
        await newItem.save();
        return Response.json({ message: "Item created successfully", item: newItem }, { status: 200 });
    } catch (error) {
        console.log(error.message);
        return Response.json({ error: error.message }, { status: 500 });
    }
}
