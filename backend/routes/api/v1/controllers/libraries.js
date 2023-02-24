import express from 'express';

var router = express.Router();

router.get('/', function(req, res, next) {
    if (req.session.isAuthenticated) {
        
    } else {
        
    }
});

export default router;
