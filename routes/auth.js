import express from 'express'
import { login, register } from '../controllers/auth.js';
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // ၁၅ မိနစ် (Milliseconds နဲ့ တွက်တာပါ)
  max: 100, // ၁၅ မိနစ်အတွင်း IP တစ်ခုကနေ အများဆုံး Request ၁၀၀ ပဲ ခွင့်ပြုမယ်
  standardHeaders: true, // Rate limit info ကို `RateLimit-*` headers ထဲမှာ ထည့်ပြမယ်
  legacyHeaders: false, // `X-RateLimit-*` headers တွေကို ပိတ်ထားမယ်
  message: "Too many requests from this IP, please try again after 15 minutes", // သတ်မှတ်ချက်ကျော်ရင် ပြမယ့်စာ
});


const router=express.Router();


router.post('/register',limiter,register);

router.post('/login',limiter,login);

export default router;