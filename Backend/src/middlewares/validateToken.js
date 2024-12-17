const jwt = require('jsonwebtoken')

const validateToken = (req, res, next) => {
    //buscar el token desde authorization bearer
    //signo ? indica que si trae informacion ejecuta el split 
    const token = req.header('Authorization')?.split(' ')[1]
    try {
        //codigo 401 es un error de no autorizado
        if (!token) return res.status(401).json({
            ok: false,
            msg: 'Token is mandatory'
        })
        //trae la variable de la llave secreta
        const secret = process.env.SECRET_KEY
        const decoded = jwt.verify(token, secret)
        //validar que el usuario que pide la peticion es el mismo del token
        req.user = decoded
        console.log(`token es:${token} y el decoded es:${decoded}`)
        console.log(decoded)
        //continue con el flujo
        next()
    } catch (error) {
        console.log(`Error validating token ${error}`)
        return res.status(500).json({
            ok: false,
            msg: `Fatal error validating token Error ${error}`
        })

    }
}

module.exports = { validateToken }