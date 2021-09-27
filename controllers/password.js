const { UserModel } = require('./../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('./../config/config');

module.exports = class Password {

    // Change password
    static async change(req, res) {
        try {
            jwt.verify(req.token, config.server.token);

            const { currentPassword, newPassword, userId } = req.body;

            // Check required fields
            if (!currentPassword || !newPassword) {
                return res.status(404).json({ msg: `Enter password fields`, code: 404 });
            }

            // Check if passwords is the same
            if (newPassword == currentPassword) {
                return res.status(404).json({ msg: `Current password can not be the same with new password`, code: 404 });
            }

            // Check password length
            if (newPassword.length < 8 || currentPassword.length < 8) {
                return res.status(404).json({ msg: `Password should be at least 8 characters`, code: 404 });
            }

            // Check if email exist
           const foundUser = await UserModel.findById(userId);
           if (!foundUser) return res.status(404).json({ msg: `No account exist for this user`, code: 404 });

           // Check password
           const password = await bcrypt.compare(currentPassword, foundUser.password);
           if (!password) return res.status(401).json({ msg: `Current password validation failed`, code: 401, obj: user});

           // hash password
           const salt = await bcrypt.genSalt(10);
           const hash = await bcrypt.hash(newPassword, salt);

           foundUser.password = hash;
           foundUser.modifyDate = Date.now();
           foundUser.save();

           if (!foundUser) return res.status(404).json({ msg: `Error occured while changing password`, code: 404 });

           /* Send out notification or Email */

           return res.status(200).json({ msg: `Password changed successfully`, code: 200, obj: foundUser });

        } catch (error) {
            return res.status(500).json({ msg: `Password change process failed`, code: 500 });
        }

    }

}