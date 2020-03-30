const { check } = require('express-validator');


module.exports = {
    validateForm: [
        check('order').isLength({ min: 1 })
        .withMessage(" must be not empty!")
        .isNumeric()
        .withMessage(" must be a number"),

        check('name', " must be not empty!")
        .isLength({ min: 1 }),

        check('status', 'must be active or inactive').custom(value => value !== 'novalue')
    ]
}