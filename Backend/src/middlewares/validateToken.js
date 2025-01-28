const jwt = require('jsonwebtoken')
const User = require('../models/User');

const validateToken = async (req, res, next) => {
    //buscar el token desde authorization bearer
    //signo ? indica que si trae informacion ejecuta el split 
    const token = req.header('Authorization')?.split(' ')[1]
    try {
        if (!token) return res.status(401).json({
            ok: false,
            message: 'Token is mandatory'
        })
        const secret = process.env.SECRET_KEY
        const decoded = jwt.verify(token, secret)

        req.user = decoded
        const { userData } = decoded
        const userValidate = await User.findById(userData);
        if (!userValidate){
            return res.status(404).json({
                ok: false,
                message: `Usuario no registra este Token`
            })    
        }
        if (userValidate.userLoginToken === null){
            return res.status(404).json({
                ok: false,
                message: `Token de usuario, con sesiòn cerrada`
            })
    
        }
        if (userValidate.userLoginToken !== token ){
            return res.status(404).json({
                ok: false,
                message: `Token inválido, no corresponde con login del usuario`
            })
    
        }
        next()
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: `Fatal error validating token Error ${error}`
        })

    }
}

module.exports = { validateToken }