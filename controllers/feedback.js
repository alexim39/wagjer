const { FeedbackModel, FeedbackValidator } = require('./../models/feedback');
const jwt = require('jsonwebtoken');
//const config = require('./../config/config');

module.exports = class Feedback {

    // Create comment
    static async create(req, res) {
        try {
            //jwt.verify(req.token, config.server.token);

            // validate inputs
            const FeedbackValidatorError = await FeedbackValidator(req.body);
            if (FeedbackValidatorError.message) return res.status(400).send(FeedbackValidatorError.message);

            const feedback = await new FeedbackModel(req.body).save();

            if (feedback) return res.status(200).json({ msg: `Message sent, we will get back to you shortly`, code: 200, obj: feedback });
            return res.status(404).json({ msg: `Message could not be sent`, code: 404 });

        } catch (error) {
            return res.status(500).json({ msg: `Feeback creation process failed`, code: 500 });
        }

    }

}