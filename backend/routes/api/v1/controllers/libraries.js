import express from 'express';
import fetch from 'node-fetch';
var router = express.Router();

router.get('/batch-insert', function(req, res, next) {
    // batch insert all libraries to the database
});


router.get('/versions/:packageName', async function(req, res, next) {
    if (req.session.isAuthenticated) {
        const packageName = req.params.packageName
        try {
            const response = await fetch(`https://registry.npmjs.org/${packageName}`)
            const data = await response.json()
            const versionKeys = Object.keys(data.versions)
            

            req.models.Library.findOne({ library: packageName }, (err, library) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        "error": err.message,
                        "status": "error"
                    }) 
                } else if (!library) {
                    console.log("!library"+versionKeys)
                    res.status(200).json(versionKeys);
                } else {
                    console.log("library+"+library)
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
