const { RefreshCwOff } = require('lucide-react');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    },

    isPending: {
        type: Boolean,
        required: true,
        default: true
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
    },

    contactNumber: {
        type: String,
        required: true,
        trim: true
    },

    reffered: {
        type: String,
        default: "none"
    },

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
        type: [
            {
                medicalKit: {
                    type: String,
                    required: true
                },
                value: {
                    type: String,
                    required: true, // Ensure the item is always provided
                },
                quantity: {
                    type: Number,
                    required: true, // Ensure the quantity is always provided
                    min: 1, // Ensure the quantity is at least 1
                },
            },
        ],
        default: [], // Default to an empty array if not provided
    },

    note: {
        type: String,
        trim: true,
        default: '' // Default to empty string if not provided
    },

    hasAgreed: {
        type: Boolean,
        required: true
    },
},
    {
        timestamps: true,
    }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;