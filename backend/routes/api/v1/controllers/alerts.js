import express from 'express';
import fetch from 'node-fetch';
var router = express.Router();

//change the alert status for registered library

router.post('/', async(req,res) => {
    try {
        let givenLibrary = await req.models.Library.findOne({
            name: req.body.name
        }, async (err, library) => {
            if (err) {
                res.status(500).json({"status": "error", "error": err})
            } else {
                await req.models.UserLibrary.findOne({
                    users: req.session.userID,
                    library: library._id,  
                    version: req.body.version  
                }, (err, userLibrary) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({
                            "error": err.message,
                            "status": "error"
                        })
                    } else {
                        userLibrary.alert_enabled = !userLibrary.alert_enabled
                    }
                    userLibrary.save()
                    res.status(200).json({
                        status: "success"
                    });
                })
            }
        })
    } catch(err) {
        console.log("Error changing the alert:", err)
        res.status(500).json({"status": "error", "error": err})
    }
    
    //get necessary fields to find the userLibrary
    //change the alert_enabled field if the toggle is clicked

    //send the post

    //save the post (update?)


})

export default router;