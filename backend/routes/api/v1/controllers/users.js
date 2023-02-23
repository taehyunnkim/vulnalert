import express from 'express';
import jwt from 'jsonwebtoken';

var router = express.Router();

router.post('/ms-login', async function(req, res, next) {
    const authorizationHeader = req.headers.authorization;
    const idToken = authorizationHeader.split(' ')[1];
    const decodedToken = jwt.decode(idToken, { complete: true });
    const parsedUser = {
        given_name: decodedToken.payload.given_name,
        family_name: decodedToken.payload.family_name,
        email: decodedToken.payload.email,
        auth_time: decodedToken.payload.auth_time,
        username: decodedToken.payload.preferred_username,
        joined_date: new Date()
    }

    const newUser = new req.models.Users(parsedUser);

    try {
        req.models.Users.findOne({ email: decodedToken.payload.email }, (err, user) => {
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
