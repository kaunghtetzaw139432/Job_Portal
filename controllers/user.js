import userModel from "../model/user.js";

export const updateUserController = async (req, res, next) => {
    if (!req.user || !req.user.userId) {
        return res.status(401).send({ message: "Auth Failed" });
    }
    const { name, email, lastName, location } = req.body;

    // ၁။ Validation စစ်ဆေးခြင်း
    if (!name || !email || !lastName || !location) {
        return next("Please Provide All Fields");
    }

    // ၂။ Login ဝင်ထားတဲ့ User ကို ID နဲ့ ရှာခြင်း
    // req.user.userId ကို userAuth middleware ကနေ ရရှိတာဖြစ်ပါတယ်
    const user = await userModel.findOne({ _id: req.user.userId });

    // ၃။ Data အသစ်များ အစားထိုးခြင်း
    user.name = name;
    user.lastName = lastName;
    user.email = email;
    user.location = location;

    // ၄။ Database မှာ Save လုပ်ခြင်း (userSchema.pre('save') က password ကို hash ထပ်လုပ်ပါလိမ့်မယ်)
    await user.save();

    // ၅။ Token အသစ်ပြန်ထုတ်ပေးခြင်း (Update လုပ်ပြီးရင် Token အသစ်ပေးတာ ပိုကောင်းပါတယ်)
    const token = user.createJWT();
    user.password = undefined;
    res.status(200).json({
        success: true,
        message: "User Updated Successfully",
        user,
        token,
    });
};