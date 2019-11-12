module.exports = {
    getUsuario : getUsuario,
    registerUsuario : registerUsuario,
    registerRapido : registerRapido,
    verificar : verificar,
    validarEmailProf : validarEmailProf,
    validarEmailRapido : validarEmailRapido,
    getProfesionales: getProfesionales,
    getUserbyEmail: getUserbyEmail,
}

const mongoDb = require("mongodb");

const mongoClient = mongoDb.MongoClient;

const mongoURL = 'mongodb://localhost:27017';

const dbName = "miDatabase";

const ObjectId = mongoDb.ObjectID;

/*
*
*Funcion que recibe un id y devuelve el objeto del usuario de dicho id 
*/
function getUsuario(id, cbOk, cbErr){

    mongoClient.connect(mongoURL, {useNewUrlParser: true}, (err, client) => {
        if(err){
            console.log("hubo error");
        }else{
            const db = client.db(dbName);

            const collection = db.collection("usersProf");

            console.log(id);

            const item = collection.find({"_id":new ObjectId(id)}).toArray((err, response) =>{
                if(err){
                    cbErr(err)
                }else{
                    cbOk(response);
                }
            });

            

            return item;
        }
        client.close();
    });

}

/*
* Recibe como parametro todos los campos de un profesional y los guarda en la BBDD
*/

function registerUsuario(nombre, apellido, email, contrasena, oficio, descripcion){
    mongoClient.connect(mongoURL, {useNewUrlParser:true}, (err, client) =>{
        if(err){
            console.log("Hubo un error. "+err);
        }else{
            const db = client.db(dbName);

            const collection = db.collection("usersProf");
            console.log("registerUsuario llamada");
            collection.insertOne({
                nombre : nombre,
                apellido : apellido,
                email :email,
                contrasena : contrasena,
                oficio : oficio,
                descripcion: descripcion
            });
        }
        client.close();
    });

}

function registerRapido(username, email, contrasena){
    mongoClient.connect(mongoURL, {useNewUrlParser:true}, (err, client) =>{
        if(err){
            console.log("Hubo un error. "+err);
        }else{
            const db = client.db(dbName);

            const collection = db.collection("usersRapido");

            collection.insertOne({
                username: username,
                email: email,
                contrasena: contrasena
            });
        }
        client.close();
    });
}
/*
*
*Funcion que verifica si el email y contraseña corresponden a un usuario registrado. 
*Invocara a CbOk con true/true si el usuario existe y es profesional
*Invocara a CbOk con true/false si el usuario existe y no es profesional
*Invocara a CbOk con  false/false si el usuario no existe
*/
function verificar(email, contrasena, cbOk, cbErr){
    mongoClient.connect(mongoURL, {useNewUrlParser:true}, (err, client) =>{
        if(err){
            cbErr(err)
        }else{
            const db = client.db(dbName);
            let collection = db.collection('usersRapido');

            collection.find({ $and : [{email:email},{contrasena:contrasena}]}).toArray((err, response) =>{
                if(response.length > 0){
                    cbOk(true, false);
                }else{
                    collection = db.collection('usersProf');
                    collection.find({$and : [{email:email}, {contrasena:contrasena}]}).toArray((err, response) =>{
                        if(response.length > 0){
                        cbOk(true, true);
                        }else{
                            cbOk(false, false);
                        }
                    });
                }
            });            
        }
        client.close();
    });
}

/*
*
*
*Funcion que se encarga de verificar que ese email no se encuentre registrado como profesional.
*Tiene un callback al que llamara pasando como parametro true en caso de que ese email ya se encuentre en la bbdd
*
*/

function validarEmailProf(email, cb){
    mongoClient.connect(mongoURL, {useNewUrlParser:true}, (err, client) =>{
        if(err){
            console.log("Hubo un error");
        }else{
            const db = client.db(dbName);
            const collection = db.collection("usersProf");
            collection.find({email:email}).toArray((err, response) =>{
                if(err){
                    cb(false);
                }
                if(response.length>0){
                    cb(true);
                    console.log(response);
                }else{
                    cb(false);
                }
            });
        }
    });
}

/*
* Funcion que se encarga de verificar que ese email no se encuentre registrado como usuario rapido.
* recibe un callback al que pasa como parametro true si el usuario existe
*/

function validarEmailRapido(email, cb){
    mongoClient.connect(mongoURL, {useNewUrlParser:true}, (err, client) =>{
        if(err){
            console.log("Hubo un error");
        }else{
            const db = client.db(dbName);
            const collection = db.collection("usersRapido");
            collection.find({email:email}).toArray((err, response) =>{
                console.log(response);
                if(response.length>0){
                    cb(true);
                }else{
                    cb(false);
                }
            });
        }
    });
}


/*
*
*
*Funcion que se encarga de buscar el array con todos los profesionales y pasarlos como parametro al callback
*
*
**/
function getProfesionales(cbOk, cbErr){
    mongoClient.connect(mongoURL, {useNewUrlParser:true}, (err, client) => {
        if(err){
            cbErr("Hubo un error. "+err);
        }else{
            const db = client.db(dbName);
            const collection = db.collection("usersProf");
            collection.find().toArray((err, response) =>{
                if(err){
                    cbErr("Hubo un error al buscar en la bbdd");
                }else{
                    cbOk(response);
                }
            });
        }
    });
}

/*
* Se encarga de devolver todos los datos correspondientes a un usuario, a partir de un filtrado por email
*/
function getUserbyEmail(email, cbOk){
    mongoClient.connect(mongoURL, {useNewUrlParser:true}, (err, client) =>{
        const db = client.db(dbName);
        const collection = db.collection("usersProf");
        collection.find({email:email}).toArray((err, response) =>{
            console.log(response);
            console.log(response.length);
            cbOk(response);
        })
    });

}