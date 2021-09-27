const { SubscriptionsModel, SubscriptionValidator } = require('./../models/subscription');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const PayStack = require('paystack-node');
//const Notification = require('./../notification');

module.exports = class Deposit {

    constructor() {}

    // verify paystack payment
    static async verifyPaystack(req, res) {
        try {

            const APIKEY = config.server.paystack_api;
            const paystack = new PayStack(APIKEY, config.server.environment)

            // verifyTransaction
            const paystackVerifyPromise = paystack.verifyTransaction({
                reference: req.params.reference.toString(),
            })
            
            paystackVerifyPromise.then( (response) => {

                if (response.body.data.status === 'success') { // if deposit was completed successfuly

                    (async () => {
                        try {

                            const deposit = await new SubscriptionsModel({
                                userId: req.params.userId,
                                amount: response.body.data.amount / 100,
                                transactionId: response.body.data.reference,
                                transactionMethod: response.body.data.channel,
                                transactionStatus: "Success"
                            }).save();
                
                            if (deposit) {
                                // create notification
                               /*  const NotificationClass = await new Notification();
                                const notificationPromise = NotificationClass.create({
                                    userId: req.params.userId,
                                    title: 'Successful Deposit',
                                    body: `Your deposit of  N${response.body.data.amount / 100} was successful`,
                                    source: 'Deposit Process'
                                });
                                notificationPromise.then((notify) => {
                                    if (notify) {
                                        //console.log('notification sent')
                                    };
                                }) */
                                return res.status(200).json({ msg: `Deposit successful`, code: 200, obj: response.body });
                            }

                        } catch (error) {
                            console.error(error);
                        }
                    })();
                } else {
                    (async () => {
                        try {
                            // create notification
                            /* const NotificationClass = await new Notification();
                            const notificationPromise = NotificationClass.create({
                                userId: req.params.userId,
                                title: 'Failed Deposit',
                                body: `Your deposit of  N${response.body.data.amount / 100} was not successful`,
                                source: 'Deposit Process'
                            });
                            notificationPromise.then((notify) => {
                                if (notify) { 
                                    //console.log('notification sent')
                                };
                            }) */
                        } catch (error) {
                            console.error(error);
                        }
                    })();
                    return res.status(500).json({ msg: `Deposit was not successful`, code: 500, obj: response.body });
                }
            }).catch( (error) => {
                // deal with error
                console.error(error)
                return res.status(404).json({ msg: `Paystack verification failed`, code: 404 });
            })


        } catch (error) {
            return res.status(500).json({ msg: `Deposit verification Process failed`, code: 500 });
        }
    }

    // balance
   /*  static async getBalance(req, res) {
        try {
            jwt.verify(req.token, config.server.token);

            const BalanceClass = new Balance()
            const balancePromise = BalanceClass.accountBalance(req.params.userId);
            balancePromise.then((amount) => {
                if (amount === 0) return res.status(404).json({ msg: `No balance found`, code: 404 });
                return res.status(200).json({ msg: `Balance found`, code: 200, obj: amount });
            })

        } catch (error) {
            return res.status(500).json({ msg: `Process failed`, code: 500 });
        }
    } */

    // get status
    static async subscriptionStatus(req, res) {
        try {
            jwt.verify(req.token, config.server.token);

            const status = await SubscriptionsModel.find({ userId: req.params.userId });

            if (!status) return res.status(404).json({ msg: `No subscripton found`, code: 404 });
            return res.status(200).json({ msg: `Subscription found`, code: 200, obj: status });

        } catch (error) {
            return res.status(500).json({ msg: `Process failed`, code: 500 });
        }
    }

}