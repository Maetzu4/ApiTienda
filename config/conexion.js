//--- Conexion a al BD MySQL
//se carga el paquete o llama a la dependencia

const { DB_HOST,
    DB_NAME,
    DB_PASSWORD,
    DB_PORT,
    DB_USER
} = require("../config.js")

const mysql = require('mysql');
const conexion = mysql.createConnection(
    {
        host:DB_HOST,
        user:DB_USER,
        password:DB_PASSWORD,
        database:DB_NAME,
        port: DB_PORT
    }

);
// se abre oa conexion a la BD
conexion.connect(
    err=>{
        if(err){
            console.log('Error al conectar a la BD: '+err)
        }
        else{
            console.log('Conectado correctamente a la BD')
        }

    }
);
// se exporta para ser usada en cualquier parte del proyecto
module.exports=conexion;