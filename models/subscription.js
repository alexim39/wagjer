const mongoose = require('mongoose');
const yup = require('yup');

// exports model
exports.SubscriptionsModel = new mongoose.model('subscription', new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    amount: {
        type: Number,
        required: true
    },
    transactionId: {
        type: Number,
        required: true,
        unique: true,
        index: { unique: true }
    },
    transactionMethod: {
        type: String,
        required: true,
    },
    transactionStatus: {
        type: String,
        required: true,
    },
    depositDate: {
        type: Date,
        default: Date.now
    }
}));

// export validator
exports.SubscriptionValidator = (depositObj) => {
    let schema = yup.object().shape({
        userId: yup.string().required('UserId is required'),
        amount: yup.number().required('Amount is require'),
        transactionId: yup.number().required('Transaction ID is required'),
        transactionMethod: yup.string().required('Source of lay is required'),
        transactionStatus: yup.string(), //.required('Transaction status not set'),
        depositDate: yup.date().required('Transaction date is required').default(() => {
            return new Date();
        })
    })

    return schema.validate(depositObj).then(depositObj => depositObj).catch(error => {
        return {
            message: error.message
        }
    });
}