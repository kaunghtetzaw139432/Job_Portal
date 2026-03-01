import express from 'express'
const router = express.Router();
import { post } from '../controllers/test.js'
import userAuth from '../middlewares/auth.js';

router.post('/test', userAuth, post)

export default router;