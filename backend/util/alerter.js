import sgMail from '@sendgrid/mail';

// Temp API key
sgMail.setApiKey("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");

const LOG_PREFIX = "email-worker: ";

export async function notifyUsers(db) {
    console.log(LOG_PREFIX, "Checking for new emails to send...");
    const userLibraries = await db.UserLibrary
        .find({ vulnerabilities: { $exists: true, $not: { $size: 0 } } })
        .populate({
            path: "vulnerabilities",
            populate: {
              path: "vulnerability",
              model: "Vulnerability",
              populate: {
                path: "library",
                model: "Library",
                select: "name"
              }
            }
          })
        .populate("user")
        .populate("library");

    let data = {};
    for (const userLibrary of userLibraries) {
        const { user, library, version } = userLibrary;
        const unalertedVulnerabilities = userLibrary.vulnerabilities
            .filter(v => v.alerted === false && userLibrary.alert_enabled);

        if (unalertedVulnerabilities.length > 0) {
            // Send out email alerts for each unalerted vulnerability
            for (const vulnData of unalertedVulnerabilities) {
                const { name, description, severity, published } = vulnData.vulnerability;
                const ulv = {
                    libraryName: library.name,
                    libraryVersion: version,
                    name: name,
                    description: description,
                    severity: severity,
                    published: published
                };

                if (data[user.email]) {
                    data[user.email].push(ulv);
                } else {
                    data[user.email] = [ulv];
                }
            }
        }

        await db.UserLibVulnerability.updateMany(
            { _id: { $in: unalertedVulnerabilities.map(v => v._id) } },
            { $set: { alerted: true } }
        );
    }

    if (Object.keys(data).length > 0) {
        console.log(LOG_PREFIX, "Generating emails for " + Object.keys(data).length + " recipients...");
        let emails = [];
        for (const [userEmail, vulnerabilityData] of Object.entries(data)) {
            let recipient = userEmail;
            let subject = vulnerabilityData.length > 1 
                ? "Multiple vulnerabilities have been detected! - Vulnalert"
                : "A vulnerability was detected - Vulnalert";
            let body = "";
            
            for (const data of vulnerabilityData) {
                body += generateReport(
                    data.libraryName,
                    data.libraryVersion,
                    data.name,
                    data.published,
                    data.severity,
                    data.description
                );
            }
    
            emails.push(
                createEmail(recipient, subject, body)
            );
        }
    
        sendEmails(emails);
    }
}

function generateReport(
    libraryName,
    libraryVersion,
    name,
    published,
    severity,
    description
) {
return `
Library: ${libraryName}
Version: ${libraryVersion}
Vulnerability Name: ${name}
Vulnerability Reported: ${published}
Vulnerability Severity: ${severity}
Vulnerability Description: ${description}
----------------------------------------------
`;
}

function sendEmails(emails) {
    if (emails.length > 0) {
        console.log(LOG_PREFIX, "Sending out the emails...");
        sgMail
            .sendMultiple(emails)
            .then(() => {
                console.log(LOG_PREFIX, "Emails sent!");
            }, error => {
                console.error(error);
    
                if (error.response) {
                    console.error(error.response.body)
                }
            });
    }
}

function createEmail(
    recipient,
    subject,
    text
) {
    return {
        to: recipient,
        from: "vulnalert@taehyunkim.me",
        subject: subject,
        text: text
    }
};