import express from 'express';
import fetch from 'node-fetch';
var router = express.Router();

router.get('/batch-insert', function(req, res, next) {
    // batch insert all libraries to the database
});


router.get('/versions/:packageName', async function(req, res, next) {
    const packageName = req.params.packageName
    if (packageName)  {
        const response = await fetch(`https://registry.npmjs.org/:${packageName}`)
        const data = await response.json();
        if (data && data.versions) {
            let versionKeys = Object.keys(data.versions);
        }

        console.log("version key :" + versionKeys)


        let currPackage = await req.models.Library.find({ library: packageName }, (err, library) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    "error": err.message,
                    "status": "error"
                }) 
            } else if (!library) {
                res.status(200).json({versionKeys} );
            } else {
                res.status(200).json({
                    versions: library.versions
                });
            }
        })

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
