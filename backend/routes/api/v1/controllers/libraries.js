import express from 'express';
import fetch from 'node-fetch';
import moment from "moment";
import NodeCache from 'node-cache';

var router = express.Router();

const ttlSeconds = 24 * 60 * 60;
const maxKeys = 500;
const librariesCache = new NodeCache({ stdTTL: ttlSeconds, maxKeys: maxKeys });

/* 
    @endpoint: /
    @method: GET
    @description: Send back the authenticated user their registered libraries.
*/ 
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
                            "error": "Error from our side :(",
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

/* 
    @endpoint: /register
    @method: POST
    @body: packageName, version
    @description: register the library for the authenticated user.
*/ 
router.post('/register', async function(req, res) {
    const packageName = req.body.packageName;
    if(req.session.isAuthenticated){
        try{
            let userID = req.session.userID

            req.models.Library.findOne({ name: packageName }, (err, library) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        "error": "Error from our side :(",
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
                                "error": "Error from our side :(",
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
            res.status(500).json({"status": "error", "error": "Error from our side :("});
        }
    } else {
        res.status(401).json({
            status: "error",
            error: "not logged in"
        });
    }
})

/* 
    @description: Middleware that checks node-cache for library names based on prefix.
*/ 
const verifyPrefixCache = (req, res, next) => {
    try {
        if (req.session.isAuthenticated) {
            const prefix = req.params.prefix;
            if (prefix) {
                if (librariesCache.has(prefix)) {
                    return res.status(200).json(librariesCache.get(prefix));
                }

                return next();
            }
        } else {
            res.status(400).json(
                {
                status: "error",
                error: "User is not logged in"
                }
            )
        }
    } catch (err) {
        throw new Error(err);
    }
};

/* 
    @endpoint: /:prefix
    @method: GET
    @params: prefix
    @description: returns the library names based on the prefix.
*/ 
router.get('/:prefix', verifyPrefixCache, async function(req, res, next) {
    if (req.session.isAuthenticated) {
        const prefix = req.params.prefix;
        if (prefix) {
            try {
                req.models.Library
                .find({ name: { "$regex": "^" + prefix } })
                .limit(50)
                .exec(async (err, libraries) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({
                            error: "Error from our side :(",
                            status: "error"
                        }) 
                    } else {
                        const options = libraries.map(library => {
                            return {
                                value: library.name,
                                label: library.name,
                                id: library.name
                            }
                        });
                        librariesCache.set(prefix, options);
                        res.status(200).json(options);
                    }
                })
            } catch (err) {
                console.log(err);
                res.status(500).json(
                    {
                        status: "error",
                        error: "There was an error from our side :("
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

/* 
    @endpoint: /versions/:packageName
    @method: GET
    @params: packageName
    @description: returns the version history for the given package.
*/ 
router.get('/versions/:packageName', async function(req, res, next) {
    if (req.session.isAuthenticated) {
        const packageName = req.params.packageName
        try {
            req.models.Library.findOne({ name: packageName }, async (err, library) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        "error": "Error from our side :(",
                        "status": "error"
                    }) 
                } else if (!library) {
                    res.status(500).json({
                        "error": "The library doesn't exist!",
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
                    error: "There was an error from our side :("
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
