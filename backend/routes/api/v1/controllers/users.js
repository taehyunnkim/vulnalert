import express from 'express';

var router = express.Router();

router.post('/ms-login', async function(req, res, next) {
    const authorizationHeader = req.headers.authorization;
    const accessToken = authorizationHeader.split(' ')[1];
    const response = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    const data = await response.json();

    const parsedUser = {
        given_name: data.givenName,
        family_name: data.surname,
        email: data.mail,
        username: data.userPrincipalName,
        joined_date: new Date()
    }

    const newUser = new req.models.Users(parsedUser);

    try {
        req.models.Users.findOne({ email: data.mail }, (err, user) => {
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
