const mongoose = require('mongoose');
const yup = require('yup');

// exports
exports.FeedbackModel = new mongoose.model('Feedback', new mongoose.Schema({
    userId: {
        //type: mongoose.Schema.Types.ObjectId, 
        type: String,
        ref: 'User'
    },
    email: {
        type: String,
        require: true
    },
    tellUsAbout: {
        type: String,
        require: true
    },
    feedbackMsg: {
        type: String,
        require: true
    },
    reply: {
        type: Boolean,
        require: true
    },
    createDate: {
        type: Date,
        require: true,
        default: Date.now
    },
    modifyDate: {
        type: Date,
        default: Date.now
    }
}));


exports.FeedbackValidator = (feedbackObj) => {
    let schema = yup.object().shape({
        tellUsAbout: yup.string().required().min(3, 'Info should be a little descriptive').max(100, 'Info is too long'),
        email: yup.string().min(5, 'Email is too short').max(350, 'Email is too long'),
        feedbackMsg: yup.string().min(3, 'Message is too short').max(350, 'Message is too long')
    })

    return schema.validate(feedbackObj).then(feedbackObj => feedbackObj).catch(error => {
        return {
            message: error.message
        }
    });
};