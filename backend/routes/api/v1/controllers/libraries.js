import express from 'express';
import fetch from 'node-fetch';

var router = express.Router();

router.get('/:prefix', async function(req, res, next) {
    if (req.session.isAuthenticated) {
        const prefix = req.params.prefix;
        if (prefix) {
            try {
                req.models.Library.findOne({ name: { "$regex": "^" + prefix } }, async (err, libraries) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({
                            error: err.message,
                            status: "error"
                        }) 
                    } else {
                        res.status(200).json(libraries);
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
                }else {
                    if(library.versions.length === 0) {
                        let response = await fetch(`https://registry.npmjs.org/${packageName}`)
                        let data = await response.json()
                        let versionKeys = Object.keys(data.versions)
                        library.versions = versionKeys 
                        library.save()
                    }

                    res.status(200).json({
                        versions: library.versions
                    });
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
