import connectToDatabse from "@/lib/mongodb";
import Doctor from "@/models/Doctor";

export async function GET(req) {
    await connectToDatabse();

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const email = searchParams.get('email');

        if (id) {
            // Fetch a specific doctor by ID
            const doctor = await Doctor.findById(id);

            if (!doctor) {
                return Response.json({ error: "Doctor not found" }, { status: 404 });
            }

            return Response.json({ doctor });
        } else if (email) {
            // Fetch a specific doctor by email
            const doctor = await Doctor.findOne({ email });

            if (!doctor) {
                return Response.json({ error: "Doctor not found" }, { status: 404 });
            }

            return Response.json({ doctor });
        } else {
            // Fetch all doctors if no ID or email is specified
            const doctors = await Doctor.find({});
            return Response.json({ doctors });
        }
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    await connectToDatabse();
    console.log('running request');
    try {
        const { firstName, lastName, email, password, role } = await req.json();
        console.log(firstName, lastName, email, password, role);

        const newDoctor = new Doctor({ firstName, lastName, email, password, role });
        await newDoctor.save();

        return Response.json({ message: "Doctor Created Successfully", doctor: newDoctor }, { status: 200 });
    } catch (error) {
        console.log(error.message);
        return Response.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    await connectToDatabse();
    console.log('running PUT request');
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id'); // Get the doctor's ID from the query parameters

        if (!id) {
            return Response.json({ error: "Doctor ID is required" }, { status: 400 });
        }

        // Get the updated fields from the request body
        const { firstName, lastName, email, password, role } = await req.json();

        // Find the doctor by ID and update their details
        const updatedDoctor = await Doctor.findByIdAndUpdate(
            id,
            { firstName, lastName, email, password, role },
            { new: true } // Return the updated document
        );

        if (!updatedDoctor) {
            return Response.json({ error: "Doctor not found" }, { status: 404 });
        }

        return Response.json({ message: "Doctor Updated Successfully", doctor: updatedDoctor }, { status: 200 });
    } catch (error) {
        console.log(error.message);
        return Response.json({ error: error.message }, { status: 500 });
    }
}