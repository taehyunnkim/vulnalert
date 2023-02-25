import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import sessions from 'express-session';

const appSettings = {
    appCredentials: {
        auth: {
            clientId:  "c1ee541a-68a4-4abf-9494-270544b5d668",
            tenantId:  "https://login.microsoftonline.com/f6b6dd5b-f02f-441a-99a0-162ac5060bd2",
            clientSecret:  "~Qu8Q~KFDyOw.7XYCZszYAPEXq_euq3jLrrhvcoC"
        }
    },	
    authRoutes: {
        redirect: "http://localhost:3000/redirect",// note: you can explicitly make this "localhost:3000/redirect" or "examplesite.me/redirect"
        error: "/error", // the wrapper will redirect to this route in case of any error.
        unauthorized: "/unauthorized" // the wrapper will redirect to this route in case of unauthorized access attempt.
    }
};

import apiv1Router from './routes/api/v1/apiv1.js';
import models from './models.js'


import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("../frontend/build"));

app.use((req, res, next) => {
    req.models = models
    next();
})

app.use(sessions({
    secret: "this is some secret key I am making up 09532poi fn4eelhu jfcbds",
    saveUninitialized: true,
    resave: false
}))

app.use('/api/v1', apiv1Router);

export default app;
