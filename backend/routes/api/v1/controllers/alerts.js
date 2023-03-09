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
                    "error": "Error from our side :("
                })
            } else {
                req.models.UserLibrary.findOne({
                    user: req.session.userID,
                    library: library.id,  
                    version: req.body.version  
                }, (err, userLibrary) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({
                            "error": "Error from our side :(",
                            "status": "error"
                        })
                    } else if (userLibrary) {
                        userLibrary.alert_enabled = req.body.alert_enabled;
                        userLibrary.save()
                        res.status(200).json({
                            status: "success",
                            alert_enabled: userLibrary.alert_enabled
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
        res.status(500).json({"status": "error", "error": "Error from our side :("})
    }
})

export default router;