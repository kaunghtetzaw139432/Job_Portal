import JWT from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    // ၁။ Header ထဲမှာ Authorization ပါ၊ မပါ စစ်မယ်
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).send({
            success: false,
            message: 'Authentication Failed: No Token Provided'
        });
    }

    // ၂။ "Bearer <token>" ထဲကနေ token စာသားလေးကိုပဲ ခွဲထုတ်ယူမယ်
    const token = authHeader.split(' ')[1];

    try {
        // ၃။ Token က မှန်သလား၊ သက်တမ်းကုန်နေပြီလား စစ်မယ်
        const payload = JWT.verify(token, process.env.JWT_SECRET);

        // ၄။ Token ထဲမှာပါတဲ့ userId ကို req.user ထဲ ထည့်ထားလိုက်မယ်
        // ဒါမှ နောက်ထပ် controller တွေက ဘယ်သူ login ဝင်ထားလဲဆိုတာ သိမှာပါ
        req.user = { userId: payload.userId };

        next(); // နောက်ထပ် Controller ဆီ ဆက်သွားခွင့်ပြုမယ်
    } catch (error) {
        return res.status(401).send({
            success: false,
            message: 'Authentication Failed: Invalid Token'
        });
    }
};

export default userAuth;