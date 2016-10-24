var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

var Trade = mongoose.model('Trade');
var Survivor = mongoose.model('Survivor');

router.use(bodyParser.urlencoded({ extended: true }));

//Used to check if there is survivors in the database before each request
router.use(function(req, res, next){
    Survivor.count({}, function (err, total){
        if (err) {
            console.error(err);
        } else if(total == 0 || isNaN(total)){
            res.json({message: "There is no survivor registered in the database yet."});
        } else {
            req.total = total;
            next();

        }
    });
});
router.get('/percentage/infected',function(req, res) {
    Survivor.count({'isInfected': true}, function (err, infected){
        if(err) {
            console.error(err);
        }
        res.json({infected: ((infected / req.total) * 100).toFixed(2) + "%"});
    });
});
router.get('/percentage/non-infected',function(req, res) {
    Survivor.count({'isInfected': false}, function (err, non_infected){
        if(err) {
            console.error(err);
        }
        res.json({non_infected: ((non_infected / req.total) * 100).toFixed(2) + "%"});
    });
});
router.get('/lost-points',function(req, res) {
    Survivor.find({'isInfected': true}, function (err, survivors){
        if(err) {
            console.error(err);
        }
        totalPoints = 0;
        survivors.forEach(function(survivor){
            totalPoints += survivor.getTotalPoints();
        });
        res.json({lost_points: totalPoints});
    });
});
router.get('/average-resources',function(req, res) {
    Survivor.find({}, function (err, survivors){
        if(err) {
            console.error(err);
        }
        res.json(Survivor.getAverageResources(survivors));
    });
});

module.exports = router;
