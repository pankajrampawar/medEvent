import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: {
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

    // location: {
    //     type: String,
    //     rquired: true
    // },

    // doctors: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'Doctor'
    //     },
    // ],
});

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema)

export default Event;