import sgMail from "@sendgrid/mail";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";

// Temp API key
sgMail.setApiKey("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");

const LOG_PREFIX = "email-worker: ";

/* 
    @description: send email notifications to users.
*/ 
export async function notifyUsers(db, dirPath) {
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
        const templatePath = path.join(dirPath, "util", "email_template.hbs");
        const source = fs.readFileSync(templatePath, "utf8");
        const template = handlebars.compile(source);
        
        let emails = [];
        for (const [userEmail, vulnerabilityData] of Object.entries(data)) {
            let recipient = userEmail;
            let subject = vulnerabilityData.length > 1 
                ? "Multiple vulnerabilities have been detected!"
                : "A vulnerability was detected!";
            
            const html = generateHtmlReport(template, { vulnerabilities: vulnerabilityData });
    
            emails.push(createEmail(recipient, subject, html));
        }
    
        sendEmails(emails);
    }
}

function generateHtmlReport(template, data) {
    return template(data)
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
    html
) {
    return {
        to: recipient,
        from: {
            name: "Vulnalert",
            email: "alert@vulnalert.app"
        },
        subject: subject,
        html: html
    }
};






async function notifyUsersTest(__dirname) {
    const templatePath = path.join(__dirname, "util", "email_template.hbs");
    const htmlWritePath = path.join(__dirname, "util", "generated_html.html");

    const data = {
        vulnerabilities: [
          {
            libraryName: 'Express',
            libraryVersion: '4.17.1',
            name: 'Remote Code Execution',
            description: 'Allows attackers to execute arbitrary code on the server',
            severity: 'Critical',
            published: '2021-02-09'
          },
          {
            libraryName: 'React',
            libraryVersion: '17.0.2',
            name: 'Cross-Site Scripting (XSS)',
            description: 'Allows attackers to inject malicious scripts into web pages',
            severity: 'Medium',
            published: '2021-02-10'
          }
        ]
    };

    console.log(LOG_PREFIX, "Testing email template...");
    const source = fs.readFileSync(templatePath, "utf8");
    console.log(LOG_PREFIX, "Compiling email template...");
    const template = handlebars.compile(source);
    console.log(LOG_PREFIX, "Generating email html...");
    const html = generateHtmlReport(template, data);
    console.log(LOG_PREFIX, "Writing email html...");
    fs.writeFileSync(htmlWritePath, html);

    const email = createEmail("kim2000@uw.edu", "Test Report", html);
    // sendEmails([email])
}