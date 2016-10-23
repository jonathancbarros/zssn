const mongoose = require('mongoose');

const items = ['water', 'ammunition', 'food', 'medication'];

const survivorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true, enum: ['M', 'F'] },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    contamination_counter: { type: Number, default: 0 },
    resources: [{ 
        _id: false,
        item: { type: String, required: true, enum: items },
        amount: { type: Number, required: true }
    }]
});

module.exports = mongoose.model('Survivor', survivorSchema);