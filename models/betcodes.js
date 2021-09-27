const mongoose = require('mongoose');
const yup = require('yup');

// Schema
const BetcodeSchema = new mongoose.Schema({
    bookmaker: {
        type: String,
        require: true,
        minlength: 3,
        maxlength: 100
    },
    code: {
        type: String,
        require: true,
        minlength: 3,
        maxlength: 50
    },
    odd: {
        type: String,
        require: true
    },
    startDate: {
        type: String,
        require: true,
    },
    startTime: {
        type: String,
        require: true,
    },
    endDate: {
        type: String,
        require: true,
    },
    endTime: {
        type: String,
        require: true,
    },
    createDate: {
        type: Date,
        require: true,
        default: Date.now
    },
    modifyDate: {
        type: Date,
        default: Date.now
    },
    outcome: {
        type: String,
        require: true,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        require: true
    }
})

// yup validation
const BetcodesValidator = (betcodes) => {
    let schema = yup.object().shape({
        bookmaker: yup.string().required().min(3, 'Bookmaker name should be a little descriptive').max(100, 'Name too long'),
        code: yup.string().required().min(3, 'Code should be a little meaningful').max(400, 'Code too much'),
        odd: yup.string().required('Odd is required'),
        startDate: yup.string().required('Date is required'),
        startTime: yup.string().required('Time is required'),
        endDate: yup.string().required('Date is required'),
        endTime: yup.string().required('Time is required'),
        creator: yup.string().required('Code creator is required')
    })

    return schema.validate(betcodes).then(betcodes => betcodes).catch(error => {
        return {
            message: error.message
        }
    });
}

// exports
exports.BetcodesModel = new mongoose.model('betcode', BetcodeSchema);
exports.BetcodesValidator = BetcodesValidator;