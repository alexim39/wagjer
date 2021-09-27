const mongoose = require('mongoose');
const yup = require('yup');

//Schema
const UserReportSchema = new mongoose.Schema({
    reportDate: {
        type: Date,
        require: true,
        default: Date.now
    },
    modifyDate: {
        type: Date,
        default: Date.now
    },
    reporter: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        require: true
    },
    reportee: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        require: true
    },
    tellUsAboutUser: {
        type: String,
        require: true,
    },
    reportMsg: {
        type: String,
        require: true,
    },
    reply: {
        type: Boolean
    }
})

// yup validation
const UserReportValidator = (reportObj) => {
    let schema = yup.object().shape({
        reportee: yup.string().required('Reportee is required'),
        reporter: yup.string().required('Reporter is required'),
        reportMsg: yup.string().min(3, 'message is too short').max(550, 'message is too long').required('message is required')
    })

    return schema.validate(reportObj).then(reportObj => reportObj).catch(error => {
        return {
            message: error.message
        }
    });
}

// exports
exports.UserReportModel = new mongoose.model('Report', UserReportSchema);
exports.UserReportValidator = UserReportValidator;