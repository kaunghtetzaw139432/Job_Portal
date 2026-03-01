import userModel from "../model/user.js"
export const register = async (req, res, next) => {

    const { name, email, password } = req.body;
    // if (!name) {
    //     next("Name is required")
    // }
    // if (!email) {
    //     next("Email is required")
    // }
    // if (!password) {
    //     next("Password is required and greater than 6 characters")
    // }
    // const existingUser = await userModel.findOne({ email });
    // if (existingUser) {
    //     next("Email Already Register Please login")
    // }
    const user = await userModel.create({ name, email, password })
    const token = user.createJWT()
    res.status(201).send({
        success: true,
        message: 'User Created Successfully',
        user: {
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            location: user.location
        },
        token
    })

};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        next('Please Provide All Fields')
    }

    const user = await userModel.findOne({ email })
    if (!user) {
        next('Invalid Username or password')
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
        next('Invalid Username or password');
    }
    const token = user.createJWT()
    user.password = undefined;
    user.__v = undefined;
    res.status(200).json({
        success: true,
        message: 'Login Successfully',
        user,
        token
    })

}