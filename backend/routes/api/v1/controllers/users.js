import express from 'express';
import fetch from 'node-fetch';

var router = express.Router();

router.post('/ms-login', async function(req, res, next) {
    const authorizationHeader = req.headers.authorization;
    const accessToken = authorizationHeader.split(' ')[1];
    const response = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (response.ok) {
        const data = await response.json();

        const parsedUser = {
            given_name: data.givenName,
            family_name: data.surname,
            email: data.mail,
            username: data.userPrincipalName,
            joined_date: new Date()
        }
    
        const newUser = new req.models.Users(parsedUser);
    
        // Create a new session with the user
        req.session.isAuthenticated = true;
        req.session.email = data.mail;
        req.session.accessToken = accessToken;
   
    
        try {
            req.models.Users.findOne({ email: data.mail }, (err, user) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        "error": err.message,
                        "status": "error"
                    }) 
                } else if (!user) {
                    newUser.save();
                    req.session.userID = newUser._id
                    res.status(200).json({
                        "status": "success"
                    });
                } else {
                    req.session.userID = user._id
                    res.status(200).json({
                        "status": "success"
                    });
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
    }
})

router.get('/logout', function(req, res, next) {
    if (req.session.isAuthenticated) {
        req.session.destroy();

        res.status(200).json({
            "status": "success"
        });
    } else {
        res.status(400).json(
            {
                status: "error",
                error: "User is not logged in"
             }
        )
    }
});

export default router;
