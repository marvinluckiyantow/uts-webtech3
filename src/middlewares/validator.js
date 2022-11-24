const Validators = require('../validator');

module.exports = (validator) => {
    if (!Validators.hasOwnProperty(validator))
        throw new Error(`'${validator}' validator is not exist`)
    return async (req, res, next) => {
        try {
            await Validators[validator].validateAsync(req.body || req.params || req.query, {
                errors: {
                    wrap: {
                        label: '',
                    },
                },
                request: req.body || req.params || req.query,
            })
            next();
        } catch (error) {
            res.status(400).send({
                success: false,
                message: error.message,
            });
        }
    }
};