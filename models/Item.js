import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // Name is required for each item
        trim: true, // Removes unnecessary whitespace
        unique: true // Ensures each item name is unique
    },
    extra: Boolean,
});

const Item = mongoose.models.Item || mongoose.model("Item", itemSchema);

export default Item;