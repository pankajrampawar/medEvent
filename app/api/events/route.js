import connectToDatabse from "@/lib/mongodb";
import Event from "@/models/Event";

export async function GET(req) {
    await connectToDatabse();

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (id) {
            // Fetch a specific event by ID
            const event = await Event.findById(id);

            if (!event) {
                return Response.json({ error: "Event not found" }, { status: 404 });
            }

            return Response.json({ event });
        } else {
            // Fetch all events if no ID is specified
            const events = await Event.find({});
            return Response.json({ events });
        }
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}


export async function POST(req) {
    await connectToDatabse();
    console.log('running request')
    try {
        const { title, clientName, description, startDate, endDate, location, doctors, option, note } = await req.json();
        console.log(title, clientName, description, startDate, endDate, location)
        // validate start and end date
        if (new Date(startDate) > new Date(endDate)) {
            return Response.json({ error: "End Date must be greater than or equal to start date." }, { status: 400 });
        }

        const newEvent = new Event({ title, clientName, description, startDate, endDate, location, doctors, ...(note && { note }) });
        await newEvent.save();

        return Response.json({ message: "Event Created Successfully", event: newEvent }, { status: 200 });
    } catch (error) {
        console.log(error.message)
        return Response.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    await connectToDatabse();
    console.log('running PUT request');
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id'); // Get the event's ID from the query parameters

        if (!id) {
            return Response.json({ error: "Event ID is required" }, { status: 400 });
        }

        // Get the updated fields from the request body
        const { title, description, startDate, endDate, location, doctors, option, note } = await req.json();

        // Validate start and end date
        if (new Date(startDate) > new Date(endDate)) {
            return Response.json({ error: "End Date must be greater than or equal to start date." }, { status: 400 });
        }

        // Find the event by ID and update its details
        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            { title, description, startDate, endDate, location, doctors, ...(note && { note }) },
            { new: true } // Return the updated document
        );

        if (!updatedEvent) {
            return Response.json({ error: "Event not found" }, { status: 404 });
        }

        return Response.json({ message: "Event Updated Successfully", event: updatedEvent }, { status: 200 });
    } catch (error) {
        console.log(error.message);
        return Response.json({ error: error.message }, { status: 500 });
    }
}