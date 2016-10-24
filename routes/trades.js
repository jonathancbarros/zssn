var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

var Trade = mongoose.model('Trade');
var Survivor = mongoose.model('Survivor');

router.use(bodyParser.urlencoded({ extended: true }));

function checkTrader(trader_id, trade_resources, res, next) {
    Survivor.findById(trader_id, function(err, trader){
        if(err) {
            res.status(404);
            res.json({message: "Trader id: " + trader_id +" wasn't found."});
        } else if(trader.isInfected) {
            res.json({message: trader.name + " is infected, so this operation cannot be completed."});
        } else if(!trader.checkTradingResources(trade_resources)){
             res.json({message: trader.name + " does not have enough resource for this trade."});
        } else {
            next();
        }
    });
}

function executeTrade(trader_id, givenResources, receivedResources, res, next = null) {
    Survivor.findById(trader_id, function(err, trader){
        if(err) {
            res.json({message: "The server couldn't save your request. " + err});
        } else {
            trader.performTrade(givenResources, receivedResources);
            trader.assignPoints();
            trader.save(function(err){
                if(err) {
                    res.json({message: "The server couldn't save your request. " + err});
                } else {
                    next != null ? next() : res.json({message: "Trade completed successfully."})
                }
            });
        }
    });
}

router.post('/', function(req, res, next){
    var trade = new Trade({
        trader_1_id : req.body.trader_1_id,
        trader_2_id : req.body.trader_2_id,
        trader_1_resources : req.body.trader_1_resources,
        trader_2_resources : req.body.trader_2_resources
    });
    trade.validate(function (err) {
        if (err) {
            res.status(400);
            res.json({message: "The server couldn't save your request. " + err});
        } else {
            req.trade = trade;
            next();
        }
    });
}, function(req, res, next){
    if(req.trade.trader_1_id == req.trade.trader_2_id) {
        res.status(400);
        res.json({message: "The trade requires two different survivors."});
    } else {
        next();
    }
}, function(req, res, next){
    checkTrader(req.trade.trader_1_id, req.trade.trader_1_resources, res, next);
}, function(req, res, next){
    checkTrader(req.trade.trader_2_id, req.trade.trader_2_resources, res, next);
}, function(req, res, next){
    if(req.trade.checkTradePoints() == true) {
        next();
    } else {
        res.status(400);
        res.json({message: "Both sides of the trade should offer the same amount of points."});
    }
}, function(req, res, next){
    executeTrade(req.trade.trader_1_id, req.trade.trader_1_resources, req.trade.trader_2_resources, res, next);
}, function(req, res){
    executeTrade(req.trade.trader_2_id, req.trade.trader_2_resources, req.trade.trader_1_resources, res);
});

module.exports = router;
