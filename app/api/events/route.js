import connectToDatabse from "@/lib/mongodb";
import Event from "@/models/Event";

export async function GET(req) {
    await connectToDatabse();

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return Response.json({ error: "Id not found" }, { status: 404 })
        }

        const event = await Event.findById(id);

        if (!event) {
            return Response.json({ error: "Event not found" }, { status: 404 });
        }

        return Response.json({ event })
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}


export async function POST(req) {
    await connectToDatabse();
    console.log('running request')
    try {
        const { title, description, startDate, endDate, doctors, option, note } = await req.json();
        console.log(title, description, startDate, endDate)
        // validate start and end date
        if (new Date(startDate) > new Date(endDate)) {
            return Response.json({ error: "End Date must be greater than or equal to start date." }, { status: 400 });
        }

        const newEvent = new Event({ title, description, startDate, endDate });
        await newEvent.save();

        return Response.json({ message: "Event Created Successfully", event: newEvent }, { status: 200 });
    } catch (error) {
        console.log(error.message)
        return Response.json({ error: error.message }, { status: 500 });
    }
}