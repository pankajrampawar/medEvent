import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    clientName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    doctors: [
        {
            name: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true,
                match: [/.+\@.+\..+/, 'Please enter a valid email address'] // Basic email validation
            }
        },
    ],
});

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

export default Event;