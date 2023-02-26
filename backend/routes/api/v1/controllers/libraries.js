import express from 'express';
import fetch from 'node-fetch';
import moment from "moment";

var router = express.Router();

router.get("/", function(req, res) {
    try {
        if (req.session.isAuthenticated) {
            req.models.UserLibrary
                .find({ user: req.session.userID })
                .populate("library", "name")
                .sort({ created_date: "desc" })
                .exec((err, userLibraries) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({
                            "error": err.message,
                            "status": "error"
                        }) 
                    } else {
                        let libraryData = userLibraries.map(data => {
                            return {
                                name: data.library.name,
                                version: data.version,
                                alert_enabled: data.alert_enabled,
                                register_date: moment(data.created_date).format('MMM DD YYYY')
                            }
                        })
                        
                        res.status(200).json(libraryData);
                    }
                })
        } else {
            res.status(401).json({
                status: "error",
                error: "not logged in"
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: "error",
            error: "Serverside error..."
        });
    }
});

router.post('/register', async function(req, res) {
    const packageName = req.body.packageName;
    if(req.session.isAuthenticated){
        try{
            let userID = req.session.userID

            req.models.Library.findOne({ name: packageName }, (err, library) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        "error": err.message,
                        "status": "error"
                    }) 
                } else {
                    req.models.UserLibrary.findOne({ 
                        user: userID, 
                        library: library.id,
                        version: req.body.version
                    }, async (err, userLibrary) => {
                        if (err) {
                            res.status(500).json({
                                "error": err.message,
                                "status": "error"
                            }) 
                        } else if (!userLibrary) {
                            const registerLibrary = new req.models.UserLibrary({
                                user: userID,
                                library: library.id,
                                version: req.body.version,
                                created_date: new Date(),
                                alert_enabled: true
                            })
        
                            await registerLibrary.save();
                            res.status(200).json({status: "sucess"})
                        } else {
                            res.status(400).json({
                                "error": "Library already registered...",
                                "status": "error"
                            }) 
                        }
                    })
                }
            })
        } catch(error) {
            console.log("Error connecting to db", error);
            res.status(500).json({"status": "error", "error": error});
        }
    } else {
        res.status(401).json({
            status: "error",
            error: "not logged in"
        });
    }
})

router.get('/:prefix', async function(req, res, next) {
    if (req.session.isAuthenticated) {
        const prefix = req.params.prefix;
        if (prefix) {
            try {
                req.models.Library
                .find({ name: { "$regex": "^" + prefix } })
                .limit(100)
                .exec(async (err, libraries) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({
                            error: err.message,
                            status: "error"
                        }) 
                    } else {
                        res.status(200).json(libraries.map(library => {
                            return {
                                value: library.name,
                                label: library.name,
                                id: library.name
                            }
                        }));
                    }
                })
            } catch (err) {
                console.log(err);
                res.status(500).json(
                    {
                        status: "error",
                        error: err
                    }
                )
            }    
        } else {
            res.status(400).json(
                {
                status: "error",
                error: "Specify the library prefix"
                }
            )
        }
    } else {
        res.status(400).json(
            {
            status: "error",
            error: "User is not logged in"
            }
        )
    }
});

router.get('/versions/:packageName', async function(req, res, next) {
    if (req.session.isAuthenticated) {
        const packageName = req.params.packageName
        try {
            req.models.Library.findOne({ name: packageName }, async (err, library) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        "error": err.message,
                        "status": "error"
                    }) 
                } else if (!library) {
                    res.status(500).json({
                        "error": err.message,
                        "status": "error"
                    }) 
                } else {
                    if(library.versions.length === 0) {
                        let response = await fetch(`https://registry.npmjs.org/${packageName}`)
                        let data = await response.json()
                        let versionKeys = Object.keys(data.versions)
                        library.versions = versionKeys 
                        library.save()
                    }

                    res.status(200).json(library.versions);
                }
            })
        } catch (err) {
            console.log(err);
            res.status(500).json(
                {
                    status: "error",
                    error: err
                }
            )
        }    
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
