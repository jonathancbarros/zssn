const mongoose = require('mongoose');

const items = ['water', 'ammunition', 'food', 'medication'];

const tradeSchema = new mongoose.Schema({
    trader_1_id: { 
        type: String, 
        required: true
    },
    trader_2_id: { 
        type: String, 
        required: true
    },
    trader_1_resources: [{ 
        _id: false,
        item: { type: String, required: true, enum: items },
        amount: { type: Number, required: true, min: 1 },
    }],
    trader_2_resources: [{ 
        _id: false,
        item: { type: String, required: true, enum: items },
        amount: { type: Number, required: true, min: 1 },
    }],
    //confirmed: { type: Boolean, default: false }
});


tradeSchema.methods.getTotalPoints = function getTotalPoints(resources) {

    const points = {
        'water': 4,
        'food': 3,
        'medication': 2,
        'ammunition': 1
    };

    var totalPoints = 0;
    resources.forEach(function(resource){
        totalPoints += points[resource['item']] * resource['amount'];
    });

    return totalPoints;
};

tradeSchema.methods.checkTradePoints = function checkTradePoints() {
    return this.getTotalPoints(this.trader_1_resources) == this.getTotalPoints(this.trader_2_resources);
};

module.exports = mongoose.model('Trade', tradeSchema);
