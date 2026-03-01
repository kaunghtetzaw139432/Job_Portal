import express from 'express';
import userAuth from '../middlewares/auth.js';
import { updateUserController } from '../controllers/user.js';

const router = express.Router();

// PUT method ကို သုံးပြီး authMiddleware ကို ကြားကခံရပါမယ်
router.put('/update-user', userAuth, updateUserController);

export default router;