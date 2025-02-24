import connectToDatabse from "@/lib/mongodb";
import Doctor from "@/models/Doctor";

export async function POST(req) {
    await connectToDatabse();

    try {
        const { email, password } = await req.json();
        console.log(" email: ", email, password)
        // Find the doctor by email
        const doctor = await Doctor.findOne({ email });

        if (!doctor) {
            return Response.json({ error: "Doctor not found" }, { status: 404 });
        }

        // Check if the password matches (assuming password is stored in plaintext for simplicity)
        // In a real-world scenario, you should use hashed passwords and compare them using bcrypt or similar
        if (doctor.password !== password) {
            return Response.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // If credentials are correct, return success
        return Response.json({ message: "Authentication successful", doctor }, { status: 200 });

    } catch (error) {
        console.log(error.message);
        return Response.json({ error: error.message }, { status: 500 });
    }
}