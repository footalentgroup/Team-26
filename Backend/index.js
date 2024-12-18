const express = require('express')
const app = express()
const dotenv = require('dotenv')
const cors = require('cors')
const api = require('./src/routes/api.routes')

dotenv.config();
const port = process.env.PORT
const databaseConnect = require('./src/config/db')
databaseConnect()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use('/', api)

app.listen(port, () => {
    console.log(`Servidor conectado en el puerto ${port}`)
})

// module.exports = app;