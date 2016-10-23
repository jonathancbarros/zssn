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
                  res.json({message: "There was a problem adding the information to the database: " + err});
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
            res.status(404)
            res.json({message: 'Not found'});
        } else {
            //Once validation is done save the new item in the req and go ahead
            req.id = id;
            next();
        }
    });
});

router.route('/:id')
    .get(function(req, res) {
        mongoose.model('Survivor').findById(req.id, function (err, survivor) {
            if (err) {
                console.log('GET Error: There was a problem retrieving: ' + err);
            } else {
                console.log('GET Retrieving ID: ' + survivor._id);
                res.json(survivor);
            }
        });
    })
    .patch(function(req, res) {
        mongoose.model('Survivor').findById(req.id, function (err, survivor) {
            survivor.latitude = req.body.latitude;
	        survivor.longitude = req.body.longitude;
            survivor.save(function (err) {
                if (err) {
                    res.status(400);
                    res.json({message: "There was a problem updating the information to the database: " + err});
                } else {
                    res.json(survivor);
                }
            });
        });
    });
    
router.post('/:id/report_contamination', function(req, res) {
    mongoose.model('Survivor').findById(req.id, function (err, survivor) {
        if(survivor != null){
            survivor.contamination_counter++;
            survivor.save(function (err) {
                if (err) {
                    res.status(400);
                    res.json({ message: "There was a problem trying to report the contamination: " + err });
                } else{
                    res.json({ message: "Contamination registered successfully!" });
                }
            });
        } else {
            res.send(err);
        } 
    });
});

module.exports = router;
