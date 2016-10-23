const mongoose = require('mongoose');

const contaminationSchema = new mongoose.Schema({
    reporter_id: {
        type: String,
        required: true
    }, 
    reportee_id: { 
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Contamination', contaminationSchema);