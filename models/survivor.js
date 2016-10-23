const mongoose = require('mongoose');

const items = ['water', 'ammunition', 'food', 'medication'];

const survivorSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true
    },
    age: { 
        type: Number, 
        required: true, 
        min: 0 
    },
    gender: { 
        type: String, 
        required: true, 
        enum: ['M', 'F'] 
    },
    latitude: { 
        type: Number, 
        required: true 
    },
    longitude: { 
        type: Number, 
        required: true 
    },
    resources: [{ 
        _id: false,
        item: { type: String, required: true, enum: items },
        amount: { type: Number, required: true, min: 1 }
    }],
    contamination_counter: { type: Number, default: 0 },
    isInfected: { type: Boolean, default: false }
});

module.exports = mongoose.model('Survivor', survivorSchema);
