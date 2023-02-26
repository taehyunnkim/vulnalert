import express from 'express';
var router = express.Router();

import usersRouter from './controllers/users.js';
import librariesRouter from './controllers/libraries.js';
import alertsRouter from './controllers/alerts.js';
import vulnerabilitiesRouter from './controllers/vulnerabilities.js'

router.use('/users', usersRouter);
router.use('/libraries', librariesRouter);
router.use('/alerts', alertsRouter)
router.use('/vulnerabilities', vulnerabilitiesRouter)

export default router;