const mongoose = require('mongoose');

// Define the schema
const doctorSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Please provide a valid email address.',
        ],
    },
    password: {
        type: String,
        required: true,
        minlength: 6, // Adjust as needed for security
    },
    role: {
        type: String,
        required: true,
        enum: ['emt', 'medic', 'nppa', 'usP', 'interP'],
        default: 'emt', // Optional: set a default role
    },
});

// Create the model
const Doctor = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;