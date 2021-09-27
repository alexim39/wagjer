const { UserReportModel, UserReportValidator } = require('./../../models/user/report');
const jwt = require('jsonwebtoken');
const config = require('./../../config/config');

module.exports = class UserReport {

    // create a uer report
    static async create(req, res) {
        try {
            jwt.verify(req.token, config.server.token);            
            // validate inputs
            const reportValidatorError = await UserReportValidator(req.body);
            if (reportValidatorError.message) return res.status(400).send(reportValidatorError.message);

            const report = await new UserReportModel(req.body).save();

            if (report) return res.status(200).json({ msg: `Your report have been sent, we will attend to it`, code: 200, obj: report });
            return res.status(404).json({ msg: `Report detail could not be sent`, code: 404 });
        } catch (error) {
            return res.status(500).json({ msg: `User report process failed`, code: 500 });
        }
    }

     // get a user report
     static async getReports(req, res) {
        try {
            jwt.verify(req.token, config.server.token);

            const report = await UserReportModel.find({reportee: req.params.userId });

            if (!report) return res.status(404).json({ msg: `No report found`, code: 404 });
            return res.status(200).json({ msg: `Reports found`, code: 200, obj: report });

        } catch (error) {
            return res.status(500).json({ msg: `User report process failed`, code: 500 });
        }
    }
}