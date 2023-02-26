import express from 'express';
import fetch from 'node-fetch';
var router = express.Router();

//change the alert status for registered library

router.post('/', (req,res) => {
    try {
        req.models.Library.findOne({
            name: req.body.name
        }, async (err, library) => {
            if (err) {
                res.status(500).json({
                    "status": "error", 
                    "error": err
                })
            } else {
                req.models.UserLibrary.findOne({
                    users: req.session.userID,
                    library: library.id,  
                    version: req.body.version  
                }, (err, userLibrary) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({
                            "error": err.message,
                            "status": "error"
                        })
                    } else if (userLibrary) {
                        userLibrary.alert_enabled = req.body.enabled;
                        userLibrary.save()
                        res.status(200).json({
                            enabled: userLibrary.alert_enabled,
                            status: "success"
                        });
                    } else {
                        res.status(400).json({
                            "error": "User library not found...",
                            "status": "error"
                        })
                    }
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