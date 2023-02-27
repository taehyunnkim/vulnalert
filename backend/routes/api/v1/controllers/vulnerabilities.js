import express from 'express';

var router = express.Router();

router.get('/', async (req,res) => {
    try {
        if (req.session.isAuthenticated) {
            const userLibraries = await req.models.UserLibrary
                .find({ 
                    user: req.session.userID,
                    vulnerabilities: { $exists: true, $not: { $size: 0 } 
                } })
                .populate({
                    path: "vulnerabilities",
                    populate: {
                        path: "vulnerability",
                        model: "Vulnerability",
                    }
                }).populate({
                    path: "library",
                    select: "name"
                });

            let data = [];
            for (const userLibrary of userLibraries) {
                userLibrary.vulnerabilities.forEach(vulOb => {
                    let vulnerabilityData = {
                        libraryName: userLibrary.library.name,
                        version: userLibrary.version
                    };

                    vulnerabilityData.name = vulOb.vulnerability.name;
                    vulnerabilityData.published = vulOb.vulnerability.published;
                    vulnerabilityData.severity = vulOb.vulnerability.severity;
                    vulnerabilityData.description = vulOb.vulnerability.description;
                    vulnerabilityData.sourceHref = vulOb.vulnerability.sourceHref;
                    vulnerabilityData.sourceName = vulOb.vulnerability.sourceName;

                    data.push(vulnerabilityData)
                });
            }
            res.status(200).json(data);
        } else {
            res.status(400).json(
                {
                    status: "error",
                    error: "User is not logged in"
                 }
            )
        }
    } catch(err) {
        console.log("Error changing the alert:", err)
        res.status(500).json({"status": "error", "error": err})
    }
})

export default router;