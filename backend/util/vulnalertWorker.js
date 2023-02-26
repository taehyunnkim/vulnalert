import sgMail from '@sendgrid/mail';

// Temp API key
sgMail.setApiKey("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");

export async function checkUserLibraryVulnerabilities(db) {
    const vulnerabilities = await db.Vulnerability.find();

    for (const vulnerability of vulnerabilities) {
        const { libraryId, affected_versions } = vulnerability;
        const affectedUserLibraries = await db.UserLibrary.find({ library: libraryId, version: { $in: affected_versions } });

        if (affectedUserLibraries.length > 0) {
            const userLibVulnerability = await db.UserLibVulnerability.create({
                vulnerability: vulnerability.id,
                alerted: false
            });

            await UserLibrary.updateMany(
                { _id: { $in: affectedUserLibraries.map(ul => ul.id) } },
                { $push: { vulnerabilities: userLibVulnerability.id } }
            );
        }
    }
}