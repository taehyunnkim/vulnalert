const dummyData = {
    userVulnerabilities: [
        {
            libraryName: "node.js",
            version: "14.19.0",
            severity: "High",
            description: "A OS Command Injection vulnerability exists in Node.js versions <14.20.0, <16.20.0, <18.5.0 due to an insufficient IsAllowedHost check that can easily be bypassed because IsIPAddress does not properly check if an IP address is invalid before making DBS requests allowing rebinding attacks.",
            name: "CVE-2022-32212",
            sourceName: "NIST CVE Database",
            sourceHref: "https://nvd.nist.gov/vuln/detail/CVE-2022-32212",
            resources: ""
        },
        {
            libraryName: "rangy",
            version: "1.3.0",
            severity: "High",
            description: "All versions of the package rangy are vulnerable to Prototype Pollution when using the extend() function in file rangy-core.js.The function uses recursive merge which can lead an attacker to modify properties of the Object.prototype",
            name: "CVE-2023-26102",
            sourceName: "NIST CVE Database",
            sourceHref: "https://nvd.nist.gov/vuln/detail/CVE-2023-26102",
            resources: ""
        },
        {
            libraryName: "Sequelize",
            version: "6.29.0",
            severity: "Critical",
            description: "Sequelize is a Node.js ORM tool. In versions prior to 6.19.1 a SQL injection exploit exists related to replacements. Parameters which are passed through replacements are not properly escaped which can lead to arbitrary SQL injection depending on the specific queries in use. The issue has been fixed in Sequelize 6.19.1. Users are advised to upgrade. Users unable to upgrade should not use the `replacements` and the `where` option in the same query.",
            name: "CVE-2023-25813",
            sourceName: "NIST CVE Database",
            sourceHref: "https://nvd.nist.gov/vuln/detail/CVE-2023-25813",
            resources: ""
        }
    ],
    userLibraries: [
        {
            name: "node.js",
            version: "14.19.0",
            alert_enabled: true,
            register_date: "Jan 01, 2023"
        },
        {
            name: "rangy",
            version: "1.3.0",
            alert_enabled: true,
            register_date: "Jan 02, 2023"
        },
        {
            name: "Sequelize",
            version: "6.29.0",
            alert_enabled: true,
            register_date: "Jan 03, 2023"
        },
        {
            name: "react",
            version: "18.2.0",
            alert_enabled: false,
            register_date: "Jan 14, 2023"
        },
        {
            name: "web-vitals",
            version: "2.1.4",
            alert_enabled: false,
            register_date: "Jan 19, 2023"
        },
    ],
    trend: [
        {
            id: 1,
            data: [
                {
                    x: "Jan, 1",
                    y: 100,
                },
                {
                    x: "Jan, 2",
                    y: 80,
                },
                {
                    x: "Jan, 3",
                    y: 72,
                },
                {
                    x: "Jan, 4",
                    y: 90,
                }
            ]
        }
    ]
};

export default dummyData;