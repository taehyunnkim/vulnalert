import express from 'express';
import jwt from 'jsonwebtoken';

var router = express.Router();

router.post('/ms-login', async function(req, res, next) {
    const authorizationHeader = req.headers.authorization;
    const idToken = authorizationHeader.split(' ')[1];
    const decodedToken = jwt.decode(idToken, { complete: true });
    
    const name = decodedToken.payload.name;
    const username = decodedToken.payload.preferred_username;
    const newUser = new req.models.Users({
        name: name,
        username: username,
        email: username,
        joined_date: new Date()
    })

    try {
        req.models.Users.findOne({ email: username }, (err, user) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    "error": err.message,
                    "status": "error"
                }) 
            } else if (!user) {
                newUser.save()
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(
            {
                status: "error",
                error: err
             }
        )
    }
})


router.get('/', async function(req, res, next) {
});

export default router;
