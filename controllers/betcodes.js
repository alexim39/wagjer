const { BetcodesModel, BetcodesValidator } = require('../models/betcodes');
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const { UserModel } = require('../models/user');

module.exports = class BetCodes {

    // Create
    static async create(req, res) {
        try{      
            jwt.verify(req.token, config.server.token);

            // validate inputs
            const error = await BetcodesValidator(req.body);
            if (error.message) return res.status(400).send(error.message);

            const betcodes = await new BetcodesModel(req.body).save();

            if (betcodes) return res.status(200).json({ msg: `Betcode created`, code: 200, obj: betcodes });
            return res.status(404).json({ msg: `Betcode creation failed`, code: 404 });
        } catch (error) {
            console.log(error)
            return res.status(500).json({ msg: `Betcode creation process failed`, code: 500 });
        }

    }

    // Get all item 
    static async  getBetcodes(req, res) {
        try {
            jwt.verify(req.token, config.server.token);

            const codes = await BetcodesModel.find({ }).populate({ path: 'creator' });
            if (codes.length > 0) return res.status(200).json({ msg: `All betcodes found`, code: 200, obj: codes });
            return res.status(404).json({ msg: `No betcode found`, code: 404 });
        } catch (error) {
            return res.status(500).json({ msg: `Codes fetching process failed`, code: 500 });
        }
    }

    // Get all item for a user
    static async getUserBetcodes(req, res) {
        try {
            jwt.verify(req.token, config.server.token);

            const codes = await BetcodesModel.find({creator: req.params.userId }).populate({ path: 'creator' });
            if (codes.length > 0) return res.status(200).json({ msg: `All betcodes found`, code: 200, obj: codes });
            return res.status(404).json({ msg: `No betcode found`, code: 404 });
        } catch (error) {
            return res.status(500).json({ msg: `Codes fetching process failed`, code: 500 });
        }
    }

    // Get all item for a user by username
    static async getUserBetcodesByUsername(req, res) {
        try {
            jwt.verify(req.token, config.server.token);

            // get user by username
           const user = await UserModel.findOne({ username: req.params.username });
           if (!user) return res.status(404).json({ msg: `No account exist with this username`, code: 404 });

            const codes = await BetcodesModel.find({creator: user._id })
                .populate({ path: 'creator', populate: {path: 'followers rateups ratedowns'} });
            if (codes.length > 0) return res.status(200).json({ msg: `All betcodes found`, code: 200, obj: codes });
            return res.status(404).json({ msg: `No betcode found`, code: 404 });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ msg: `Codes fetching process failed`, code: 500 });
        }
    }

    // Update
    static async updateBetcode(req, res) {
        try {
            jwt.verify(req.token, config.server.token);

            // validate inputs
            const error = await BetcodesModel(req.body);
            if (error.message) return res.status(400).send(error.message);

            const updatedObj = await BetcodesModel.findByIdAndUpdate(req.body.id, {
                outcome: req.body.outcome,
                modifyDate: new Date(),
            }, { new: true });

            if (updatedObj) return res.status(200).json({ msg: `Code updated`, code: 200, obj: updatedObj });
            return res.status(404).json({ msg: `This code does not exist`, code: 404 });
        } catch (error) {
            return res.status(500).json({ msg: `Code process failed`, code: 500 });
        }
    }

    // Delete
    static async removeBetcode(req, res) {
        try {
            jwt.verify(req.token, config.server.token);            

            const codes = await BetcodesModel.findByIdAndDelete(req.params.codeId);
            if (codes) return res.status(200).json({ msg: `Code deleted`, code: 200, obj: codes });
            return res.status(404).json({ msg: `This code does not exist`, code: 404 });
        } catch (error) {
            console.log(error)
            return res.status(500).json({ msg: `Code removal process failed`, code: 500 });
        }
    }
}