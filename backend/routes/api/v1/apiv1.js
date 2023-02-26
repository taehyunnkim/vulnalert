import express from 'express';
var router = express.Router();

import usersRouter from './controllers/users.js';
import librariesRouter from './controllers/libraries.js';
import alertsRouter from './controllers/alerts.js'

router.use('/users', usersRouter);
router.use('/libraries', librariesRouter);
router.use('/alerts', alertsRouter)

export default router;