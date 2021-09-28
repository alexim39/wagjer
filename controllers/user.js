const { UserModel, SignInValidator, ProfileUpdateValidator } = require('./../models/user');
const jwt = require('jsonwebtoken');
const config = require('./../config/config');
//const { FollowersModel } = require('./../models/followers');

module.exports = class User {

    // get a user
    static async getUser(req, res) {
        try {
            jwt.verify(req.token, config.server.token, (error, authData) => {
                if (error) return res.status(403).json({ msg: `Invalid access request`, code: 403 });
                return res.status(200).json({ msg: `User is authorized`, code: 200, obj: authData.user }); 
            })
        } catch (error) {
            return res.status(500).json({ msg: `User access process failed`, code: 500 });
        }
    }

    // get a// users
    static async getUsers(req, res) {
        try {
           const users = await UserModel.find({ });
           if (!users) return res.status(404).json({ msg: `User access failed`, code: 404 });
           return res.status(200).json({ msg: `users found`, code: 200, obj: users });
        } catch (error) {
            return res.status(500).json({ msg: `User access process failed`, code: 500 });
        }

    }

    // update a user profile
    static async updateUser(req, res) {
        try {
            jwt.verify(req.token, config.server.token);
            
            // validate inputs
            const profileUpdateValidatorError = await ProfileUpdateValidator(req.body);
            if (profileUpdateValidatorError.message) return res.status(400).send(profileUpdateValidatorError.message);

            const updatedUser = await UserModel.findByIdAndUpdate(req.body.userId, {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                phone: req.body.phone,
                about: req.body.about,
                modifyDate: Date.now()
            }, { new: true });

            if (updatedUser) return res.status(200).json({ msg: `User profile updated`, code: 200, obj: updatedUser });
            return res.status(404).json({ msg: `Profile update failed`, code: 404 });
        } catch (error) {
            return res.status(500).json({ msg: `User access process failed`, code: 500 });
        }
    }

    // delete a user
    static async deleteUser(req, res) {
        try {
            jwt.verify(req.token, config.server.token);

            const user = await UserModel.findByIdAndDelete(req.params.userId);
            if (user) return res.status(200).json({ msg: `User profile deleted`, code: 200, obj: user });
            return res.status(404).json({ msg: `This user does not exist`, code: 404 });

        } catch (error) {
            return res.status(500).json({ msg: `User access process failed`, code: 500 });
        }
    }

    // fellow a user
    static async fellowUser(req, res) {
        try {
            jwt.verify(req.token, config.server.token);

            const user = await UserModel.findByIdAndUpdate(req.body.followee, { $push: { followers: req.body.follower}, }, { new: true, useFindAndModify: false })
            if (user) return res.status(200).json({ msg: `Your are now following user`, code: 200, obj: user });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ msg: `User fellow process failed`, code: 500 });
        }
    }

    // unfellow a user
    static async unFellowUser(req, res) {
        try {
            jwt.verify(req.token, config.server.token);

            const user = await UserModel.findByIdAndUpdate(req.body.followee, { $pull: { followers: req.body.follower}, }, { new: true, useFindAndModify: false })
            if (user) return res.status(200).json({ msg: `You unfollowed user`, code: 200, obj: user });
        } catch (error) {
            return res.status(500).json({ msg: `User fellow process failed`, code: 500 });
        }
    }

    // add rate up a user
    static async addRateUpUser(req, res) {
        try {
            jwt.verify(req.token, config.server.token);

            const user = await UserModel.findByIdAndUpdate(req.body.ratee, { $push: { rateups: req.body.rater}, }, { new: true, useFindAndModify: false })
            if (user) return res.status(200).json({ msg: `You rated user`, code: 200, obj: user });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ msg: `User rate up process failed`, code: 500 });
        }
    }

    // remove rate up a user
    static async removeRateUpUser(req, res) {
        try {
            jwt.verify(req.token, config.server.token);

            const user = await UserModel.findByIdAndUpdate(req.body.ratee, { $pull: { rateups: req.body.rater}, }, { new: true, useFindAndModify: false })
            if (user) return res.status(200).json({ msg: `You stopped rating user`, code: 200, obj: user });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ msg: `User rate up process failed`, code: 500 });
        }
    }

    // rate down a user
    static async addRateDownUser(req, res) {
        try {
            jwt.verify(req.token, config.server.token);

            const user = await UserModel.findByIdAndUpdate(req.body.ratee, { $push: { ratedowns: req.body.rater}, }, { new: true, useFindAndModify: false })
            if (user) return res.status(200).json({ msg: `You unrated user`, code: 200, obj: user });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ msg: `User rate down process failed`, code: 500 });
        }
    }

    // rate down a user
    static async removeRateDownUser(req, res) {
        try {
            jwt.verify(req.token, config.server.token);

            const user = await UserModel.findByIdAndUpdate(req.body.ratee, { $pull: { ratedowns: req.body.rater}, }, { new: true, useFindAndModify: false })
            if (user) return res.status(200).json({ msg: `Your stopped unrating user`, code: 200, obj: user });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ msg: `User rate down process failed`, code: 500 });
        }
    }

    // raport a user
    static async getUserReferers(req, res) {
        try {
            jwt.verify(req.token, config.server.token);

            const users = await UserModel.find({referer: req.params.userId });
           if (!users) return res.status(404).json({ msg: `User referers access failed`, code: 404 });
           return res.status(200).json({ msg: `user referers found`, code: 200, obj: users });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ msg: `User referer access process failed`, code: 500 });
        }
    }

}