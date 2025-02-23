import connectToDatabse from "@/lib/mongodb";
import Doctor from "@/models/Doctor";


export async function GET(req) {
    await connectToDatabse();

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (id) {
            // Fetch a specific event by ID
            const event = await Doctor.findById(id);

            if (!event) {
                return Response.json({ error: "Event not found" }, { status: 404 });
            }

            return Response.json({ event });
        } else {
            // Fetch all events if no ID is specified
            const doctors = await Doctor.find({});
            return Response.json({ doctors });
        }
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    await connectToDatabse();
    console.log('running request')
    try {
        const { firstName, lastName, email, password, role } = await req.json();
        console.log(firstName, lastName, email, password, role);

        const newDoctor = new Doctor({ firstName, lastName, email, password, role });
        await newDoctor.save();

        return Response.json({ message: "Event Created Successfully", doctor: newDoctor }, { status: 200 });
    } catch (error) {
        console.log(error.message)
        return Response.json({ error: error.message }, { status: 500 });
    }
}