const mongoose = require('mongoose')
require('dotenv').config({path:'variables.env'})

const conectarDB = async ()=>{
    try {
        await mongoose.connect(process.env.DB_MONGO,{
            useNewUrlParser:true,
            useUnifiedTopology: true,
            useFindAndModify:false,
            useCreateIndex:true
        })
        console.log("DB CONECTED")
        
    } catch (error) {
        console.log("ERRO al conectar db")
        console.log(error)
        process.exit()
    }
}
module.exports = conectarDB