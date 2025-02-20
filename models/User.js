const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // Required fields

    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    },

    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    contactNumber: {
        type: String,
        required: true,
        trim: true
    },

    // Optional fields
    chiefComplaint: {
        type: String,
        trim: true,
        default: '' // Default to empty string if not provided
    },
    allergic: {
        type: mongoose.Schema.Types.Mixed, // Can be a string (allergy details) or boolean (false)
        default: false // Default to false if not provided
    },
    primaryDiagnosis: {
        type: String,
        trim: true,
        default: '' // Default to empty string if not provided
    },
    conditionCategory: {
        type: String,
        trim: true,
        default: '' // Default to empty string if not provided
    },
    charmChartFilledOut: {
        type: Boolean,
        default: false // Default to false if not provided
    },
    otcSuppliesDispensed: {
        type: Boolean,
        default: false // Default to false if not provided
    },
    note: {
        type: String,
        trim: true,
        default: '' // Default to empty string if not provided
    }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;