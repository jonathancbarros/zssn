var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));

//Build the REST operations at the base for survivors
//This will be accessible from http://127.0.0.1:3000/survivors if the default route for / is left unchanged
router.route('/')
    //GET all survivors
    .get(function(req, res, next) {
        mongoose.model('Survivor').find({}, function (err, survivors) {
            if (err) {
                console.error(err);
            } else {
                res.json(survivors);
            }
        });
    })
    .post(function(req, res) {
        // Get values from POST request.
        mongoose.model('Survivor').create({
            name :      req.body.name,
            age :       req.body.age,
            gender :    req.body.gender,
            latitude :  req.body.latitude,
            longitude : req.body.longitude,
            resources : req.body.resources
        }, function (err, survivor) {
              if (err) {
                  res.status(400);
                  res.json({message: "The server couldn't save your request. " + err});
              } else {
                  console.log('POST creating new survivor: ' + survivor.name);
                  res.json(survivor);
              }
        })
    });

// Route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('Survivor').findById(id, function (err, survivor) {
        //if it isn't found, we are going to repond with 404
        if (err) {
            console.log('Id: ' + id + ' was not found');
            res.status(404);
            res.json({message: 'Survivor Not found'});
        } else {
            //Once validation is done save the new item in the req and go ahead
            req.survivor = survivor;
            next();
        }
    });
});

router.route('/:id')
    .get(function(req, res) {
        console.log('GET Retrieving ID: ' + req.survivor._id);
        res.json(req.survivor);
    })
    .patch(function(req, res) {
        req.survivor.latitude = req.body.latitude;
	    req.survivor.longitude = req.body.longitude;
        req.survivor.save(function (err) {
            if (err) {
                res.status(400);
                res.json({message: "The server couldn't save your request. " + err});
            } else {
                res.json(req.survivor);
            }
        });
    });
    
router.post('/report_contamination', function(req, res, next) {
    
    if(req.body.reportee_id == req.body.reporter_id) {
        res.status(400);
        return res.json({message: "The server could not process your request."});
    }
    
    mongoose.model('Survivor').findById(req.body.reporter_id, function (err, reporter) {
        if(err || reporter == null) {
            res.status(400);
            res.json({message: "The server could not process your request. Reporter not found."});
        } else {
            req.reporter = reporter;
            next();
        }
    });
}, function(req, res, next) {
    mongoose.model('Survivor').findById(req.body.reportee_id, function (err, reportee) {
        if(err || reportee == null) {
            res.status(400);
            res.json({message: "The server could not process your request. Reportee not found."});
        } else {
            req.reportee = reportee;
            next();
        }
    });
}, function(req, res, next) {
    mongoose.model('Contamination').findOne(
        { reporter_id: req.reporter._id, reportee_id: req.reportee._id }, function (err, contamination) {
            if(contamination) {
                res.status(400);
                res.json({message: "You cannot register a contamination twice."});
            } else {
                next();
            }
        });
}, function(req, res){
    mongoose.model('Contamination').create({
        reporter_id : req.reporter._id,
        reportee_id : req.reportee._id,
    }, function (err, contamination) {
        if (err) {
            res.status(400);
            res.json({message: "The server couldn't save your request. " + err});
        } else {
            console.log('POST creating new contamination.');
            mongoose.model('Survivor').findById(contamination.reportee_id, function(err, reportee){

                reportee.contamination_counter++;
                if(reportee.contamination_counter >= 3) {
                    reportee.isInfected = true;
                }

                reportee.save(function(err, reporteeID){
                    if(err){
                        res.status(400);
                        res.json({ message: "The server could'n save your request. " + err });
                    } else {
                        res.json({message: "Contamination reported successfully"});
                    }
                });
            });
        }
    });
});

module.exports = router;
