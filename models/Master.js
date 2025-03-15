import mongoose from "mongoose";

const masterSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true, // Name is required for each document
        unique: true,
        trim: true // Removes unnecessary whitespace
    },
    extraItems: [{
        type: mongoose.Schema.Types.ObjectId, // Reference to the Item collection
        ref: "Item", // Name of the referenced collection
        required: false
    }],
    excludedItems: [{
        type: mongoose.Schema.Types.ObjectId, // Reference to the Item collection
        ref: "Item", // Name of the referenced collection
        required: false
    }]
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

const Master = mongoose.models.Master || mongoose.model("Master", masterSchema);

export default Master;