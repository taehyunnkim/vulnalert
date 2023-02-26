import sgMail from '@sendgrid/mail';

// Temp API key
sgMail.setApiKey("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");

export async function notifyUsers(db) {
    console.log("Setting up user library vulnerability alert...");
    const userLibraries = await db.UserLibrary
        .find({ vulnerabilities: { $exists: true, $not: { $size: 0 } } })
        .populate("vulnerabilities")
        .populate("user")
        .populate("library");

    let data = {};
    for (const userLibrary of userLibraries) {
        const { user, library, version } = userLibrary;
        const unalertedVulnerabilities = userLibrary.vulnerabilities.filter(v => !v.alerted && userLibrary.alert_enabled);

        if (unalertedVulnerabilities.length > 0) {
            await db.UserLibVulnerability.updateMany(
                { _id: { $in: unalertedVulnerabilities.map(v => v._id) } },
                { $set: { alerted: true } }
            );

            // Send out email alerts for each unalerted vulnerability
            for (const vulnerability of unalertedVulnerabilities) {
                const { name, description, severity, published } = vulnerability;
                const ulv = {
                    libraryName: library,
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
    }

    console.log("Generating emails for " + Object.keys(data).length + " recipients...");
    let emails = [];
    for (const [userEmail, vulnerabilityData] of Object.entries(data)) {
        let recipient = userEmail;
        let subject = vulnerabilityData.length > 1 
            ? "Multiple vulnerabilities have been detected! - Vulnalert"
            : "A vulnerability was detected - Vulnalert";
        let body = "";
        
        for (const data of vulnerabilityData) {
            let text = `
                Library: ${data.libraryName}
                Version: ${data.libraryVersion}
                Vulnerability Name: ${data.name}
                Vulnerability Reported: ${data.published}
                Vulnerability Severity: ${data.severity}
                Vulnerability Description: ${data.description}
                ----------------------------------------------
            `;

            body += text;
        }

        emails.push(
            createEmail(recipient, subject, body)
        );
    }

    sendEmails(emails);
}

function sendEmails(emails) {
    console.log("Sending out the emails...");
    sgMail
        .sendMultiple(emails)
        .then(() => {
            console.log("Emails sent!");
        }, error => {
            console.error(error);

            if (error.response) {
                console.error(error.response.body)
            }
        });
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