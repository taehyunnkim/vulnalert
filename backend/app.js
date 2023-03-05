import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import sessions from 'express-session';
import cron from 'node-cron';


import { checkUserLibraryVulnerabilities } from "./util/vulnalertWorker.js";
import { notifyUsers } from "./util/alerter.js";
import { models, connectToDatabase } from './models.js'

import apiv1Router from './routes/api/v1/apiv1.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CHECK_VULNERABILITY_FREQUENCY_SECONDS = 30;
const NOTIFY_USERS_FREQUENCY_SECONDS = 10;

await connectToDatabase();

console.log(`Checking user library vulnerabilities every ${CHECK_VULNERABILITY_FREQUENCY_SECONDS} seconds.`);
cron.schedule(`*/${CHECK_VULNERABILITY_FREQUENCY_SECONDS} * * * * *`, async () => {
    await checkUserLibraryVulnerabilities(models);
});

console.log(`Notifying users every ${NOTIFY_USERS_FREQUENCY_SECONDS} seconds.`);
cron.schedule(`*/${NOTIFY_USERS_FREQUENCY_SECONDS} * * * * *`, async () => {
    await notifyUsers(models, __dirname);
});

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("../frontend/build"));

app.get('/libraries', function (req, res) {
    res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

app.get('/vulnerabilities', function (req, res) {
    res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

// Make sure that the client gets the latest version of resource
app.disable('etag');

app.use((req, res, next) => {
    req.models = models;
    next();
})

app.use(sessions({
    secret: "this is some secret key I am making up 09532poi fn4eelhu jfcbds",
    saveUninitialized: true,
    resave: false
}))

app.get("/redirect", (req, res) => {
    try {
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("There was an error...");
    }
});

app.use('/api/v1', apiv1Router);

export default app;
