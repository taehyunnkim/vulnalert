import express from 'express';
var router = express.Router();

import usersRouter from './controllers/users.js';
import librariesRouter from './controllers/libraries.js';

router.use('/users', usersRouter);
router.use('/libraries', librariesRouter);

export default router;