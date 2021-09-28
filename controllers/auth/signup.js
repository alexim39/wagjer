const { UserModel, SignUpValidator } = require('../../models/user');
const bcrypt = require('bcryptjs');
const { EmailClass } = require('./../email/email')
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = class SignUp {

    // User singup
    static async register(req, res) {
        try {
            // validate inputs
            const error = await SignUpValidator(req.body);
            if (error.message) return res.status(400).send(error.message);

            // check if tnc is checked
            if (req.body.tnc === false) return res.status(400).json({ msg: `Please check the terms and condition box to continue`, code: 400 });

            // check if user already exist
            const userExist = await UserModel.findOne({ email: req.body.email });
            if (userExist) return res.status(400).json({ msg: `This email already exist, you can reset your password to continue`, code: 400 });

            // hash password
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(req.body.password, salt);

            // init signup class
            const userSignUp = new SignUp();

            const user = await new UserModel({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                username: userSignUp.getUniqueUsername(req.body.firstname, req.body.lastname),
                email: req.body.email,
                password: hash,
                tnc: req.body.tnc,
                newsLetter: req.body.newsLetter,
                referer: userSignUp.getReferer(req.body.referer)
            }).save();

            if (user) {
                // send activation email
                //const email = new EmailClass();
                //email.sendAccountActivationLink(user);
                return res.status(200).json({ msg: `Account created, sign in to continue`, code: 200, obj: user });
            } else {
               return res.status(404).json({ msg: `Account creation failed`, code: 404 });
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ msg: `Sign up process failed`, code: 500 });
        }
    }

    
    getUniqueUsername(firstname, lastname) {
        //Can change 7 to 2 for longer results.
        const r = (Math.random() + 1).toString(36).substring(7);
        return `${firstname}_${lastname}_${r}`;
    }

    getReferer(refererId) {
        if (!refererId) {
            return
        } else {
            
            // check if username is objectId
            const stringId = refererId.toString().toLowerCase();

            if (ObjectId.isValid(stringId) && new ObjectId(stringId) == stringId) {
                return stringId;
            }
        }
    }
}