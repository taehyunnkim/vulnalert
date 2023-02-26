import express from 'express';

var router = express.Router();

router.get('/', (req,res) => {
    try {
        res.status(200).json({})
    } catch(err) {
        console.log("Error changing the alert:", err)
        res.status(500).json({"status": "error", "error": err})
    }
})

export default router;