const error = (err, req, res, next) => {
    console.log(err);

    // ၁။ အခြေခံ Error ပုံစံကို အရင်သတ်မှတ်ပါ
    const defaultErrors = {
        statusCode: err.statusCode || 500,
        message: err || 'Something went wrong'
    };

    // ၂။ Mongoose Validation Error ဖြစ်ခဲ့ရင် message ကို ပြောင်းပါ
    if (err.name === 'ValidationError') {
        defaultErrors.statusCode = 400;
        defaultErrors.message = Object.values(err.errors)
            .map(item => item.message)
            .join(', ');
    }

    // ၃။ Duplicate Email Error (Optional - email တူနေရင်)
    if (err.code && err.code === 11000) {
        defaultErrors.statusCode = 400;
        defaultErrors.message = `${Object.keys(err.keyValue)} field has to be unique`;
    }

    // ၄။ နောက်ဆုံးမှ တစ်ခါတည်း Response ပြန်ပါ
    res.status(defaultErrors.statusCode).json({ 
        success: false,
        message: defaultErrors.message 
    });
};

export default error;