const { validationResult } = require("express-validator");

const validateFields = (req, res, next) => {
    const error = validationResult(req)
    if(!error.isEmpty()) {
        return res.status(400).json({
            ok: false,
            message: error.mapped()
        })
    }
    //sigue tu flujo normal
    next()
}

module.exports = validateFields
