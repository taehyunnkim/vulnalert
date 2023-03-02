import semver from 'semver';

const LOG_PREFIX = "vulnerability-worker: ";

export function checkUserLibraryVulnerabilities(db) {
    return new Promise(async (resolve, reject) => {
        try {
            let vulnerabilityExists = false;
            const vulnerabilities = await db.Vulnerability.find();
            for (const vulnerability of vulnerabilities) {
                const { library, affected_versions } = vulnerability;
                const userLibraries = await db.UserLibrary.find({ library: library }).populate("vulnerabilities")

                for (const userLibrary of userLibraries) {
                    const { version, vulnerabilities } = userLibrary;

                    const hasExistingVulnerability = vulnerabilities.some(ulv => {
                        return ulv.vulnerability.toString() === vulnerability.id;
                    });
                    
                    if (hasExistingVulnerability) {
                        // The vulnerability was already processed for this user library.
                        continue;
                    }

                    for (const affectedVersion of affected_versions) { 
                        if (semver.satisfies(version, affectedVersion) || semver.eq(version, affectedVersion)) {
                            const userLibVulnerability = await db.UserLibVulnerability.create({
                              vulnerability: vulnerability.id,
                              alerted: false
                            });
                  
                            userLibrary.vulnerabilities.push(userLibVulnerability);
                            await userLibrary.save();
                            vulnerabilityExists = true;
                            break;
                        }
                    }
                }
            }

            if (vulnerabilityExists) {
                console.log(LOG_PREFIX, "Updated user library vulnerabilities.");
            }

            resolve();
        } catch (error) {
            reject(error);
        }
    });
}