module.exports = {
    enviarMensaje: enviarMensaje,
    getMensajes: getMensajes
}

const mongoDb = require("mongodb");

const mongoClient = mongoDb.MongoClient;

const mongoURL = 'mongodb://localhost:27017';

const dbName = "miDatabase";

const ObjectId = mongoDb.ObjectID;

function enviarMensaje(idEmisor, idReceptor, mensaje){
    mongoClient.connect(mongoURL, {useNewUrlParser: true}, (err, client) =>{
        const db = client.db(dbName);
        const collection = db.collection("mensajes");
        collection.insertOne({
            idEmisor: idEmisor,
            idReceptor: idReceptor,
            mensaje: mensaje
        });
    });

}

function getMensajes(id, cbOk, cbErr){
    mongoClient.connect(mongoURL, {useNewUrlParser:true}, (err, client) =>{
        const db = client.db(dbName);
        const collection = db.collection("mensajes");
        collection.find({idReceptor: id}).toArray((err, response) =>{
            if(err){
                cbErr(err);
            }else{
                cbOk(response);
            }
        });
    });
}