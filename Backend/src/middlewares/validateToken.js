const jwt = require('jsonwebtoken')
const User = require('../models/User');
// const user = require('../controllers/user.controller')

const validateToken = async (req, res, next) => {
    //buscar el token desde authorization bearer
    //signo ? indica que si trae informacion ejecuta el split 
    const token = req.header('Authorization')?.split(' ')[1]
    try {
        //codigo 401 es un error de no autorizado
        if (!token) return res.status(401).json({
            ok: false,
            message: 'Token is mandatory'
        })
        //trae la variable de la llave secreta
        const secret = process.env.SECRET_KEY
        const decoded = jwt.verify(token, secret)

        // Buscar al usuario por email
        req.user = decoded
        const { userData } = decoded
        const userValidate = await User.findById(userData);
        console.log(`validateToken, token es:${token} y el decoded es:${userData}`)
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
        //continue con el flujo
        next()
    } catch (error) {
        console.log(`Error validating token ${error}`)
        return res.status(500).json({
            ok: false,
            message: `Fatal error validating token Error ${error}`
        })

    }
}

module.exports = { validateToken }