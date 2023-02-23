import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import sessions from 'express-session'
import msIdExpress from 'microsoft-identity-express'

const appSettings = {
    appCredentials: {
        clientId:  "33e9d280-ee1d-4925-8247-27e72bca4ecd",
        tenantId:  "f6b6dd5b-f02f-441a-99a0-162ac5060bd2",
        clientSecret:  "4BT8Q~YwhQ3vrY3bsh4S2zsWJnZURtYWl2Bo0cTN"
    },	
    authRoutes: {
        redirect: "localhost:3000/redirect",// note: you can explicitly make this "localhost:3000/redirect" or "examplesite.me/redirect"
        error: "/error", // the wrapper will redirect to this route in case of any error.
        unauthorized: "/unauthorized" // the wrapper will redirect to this route in case of unauthorized access attempt.
    }
};

import usersRouter from './routes/users.js';
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

const msid = new msIdExpress.WebAppAuthClientBuilder(appSettings).build()
app.use(msid.initialize())

app.get('/signin', 
    msid.signIn({postLoginRedirect: '/'})
)

app.get('/signout',
    msid.signOut({postLogoutRedirect: '/'})
)

app.get('/error', (req, res) => {
    res.status(500).send("Error: Server error")
})

app.get('/unauthorized', (req, res) => {
    res.status(401).send("Error: Unauthorized")
})


app.use('/users', usersRouter);

export default app;
