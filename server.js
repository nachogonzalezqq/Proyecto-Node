const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const usuario = require("./usuario");
const mensaje = require("./mensaje");
const expressSession = require('express-session');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser());
app.use(expressSession({
    secret:"Nacho12233",
    resave: false,
    saveUninitialized: false
}));
app.use(express.json());

app.engine('handlebars', exphbs({
    defaultLayout: 'main-layout',
    layoutsDir: path.join(__dirname, 'views/layouts'),
}));

app.set('view engine', 'handlebars');

app.set('views', path.join(__dirname, 'views'));

app.listen(3000, () =>{
    console.log("express escuchando en puerto 3000");
});

app.get('/', (req, res) =>{
    res.render('home');
    
    
});
/*
*Renderiza el formulario para registrar profesionales
*/

app.get('/registroprofesional', (req, res) =>{
    res.render('registroProfesional');
});

/*
*Envia a la funcion registerUsuario los parametros que llegan del form
*/
app.post('/registrarProfesional',(req, res) =>{

    let nombre = req.body.nombre;
    let apellido = req.body.apellido;
    let email = req.body.email;
    let contrasena = req.body.contrasena;
    let oficio = req.body.oficio;
    let descripcion = req.body.descripcion;
    console.log(nombre);
    console.log("/registrarProf");

    usuario.validarEmailProf(email, (respuesta) =>{

        if(respuesta){
            res.render("registroProfesional", {error:"Ese email ya se encuentra registrado"});
        }else{
            
            usuario.registerUsuario(nombre, apellido, email, contrasena, oficio, descripcion);
            res.render('usuarioRegistrado');
        }

    })

   

});
/*
*Renderiza el formulario para registro sencillo
*/
app.get('/registroRapido', (req, res) =>{
    res.render('registroRapido');
});

/*
*Envia a la funcion registerRapido los datos procedentes del formulario
*/
app.post('/registrarRapido', (req, res) => {
    let username = req.body.username;
    let email = req.body.email;
    let contrasena = req.body.contrasena;

    usuario.validarEmailRapido(email, (respuesta) =>{
        console.log("callback ejecutado");
        if(respuesta){
            res.render('registroRapido',{error:"Ese email ya se encuentra registrado"});
        }else{
            usuario.registerRapido(username, email, contrasena);
            res.render("usuarioRegistrado");
        }
    })
})

/*
*Renderiza el formulario de login
*/
app.get('/login', (req, res) =>{
    res.render('login');
});

/*
*Verifica si los datos procedentes del formulario de login corresponden a un usuario existente
* y redirige a la pagina principal, discriminando entre usuarios profesionales y rapidos
*/
app.post('/inicioSesion',(req, res) =>{
    let email = req.body.email;

    let contrasena = req.body.contrasena;



    usuario.verificar(email, contrasena, (verifica, profesional) =>{

        if(verifica){
            req.session.user = email;
            req.session.profesional = profesional;
            res.redirect("/principal");
        }else{
            
            req.session.destroy();
            res.render("login", {incorrecto:true});
        }

    }, (error) =>{
        console.log("Hubo un error. "+error);
    });

   
});

/*
* Muestra la lista de los profesionales registrados. Si el usuario registrado es profesional agrega
* un boton para ver mensajes
*/
app.get('/principal', (req, res) =>{
    if(req.session.user == undefined){
        res.redirect('/');
        console.log(req.session);
    }else{
    usuario.getProfesionales((list) =>{
        res.render("vistaPrincipal", {profesionales: list,
        profesional: req.session.profesional});
    }, (error) =>{
        console.log("Hubo un error inesperado "+error);
    });
    console.log(req.session);
    }
});

/*
* Renderiza la vista para enviar un mensaje a determinado profesional dependiendo el id que recibe
*/
app.get("/contactarUser", (req, res) =>{
    if(req.session.user == undefined){
        res.redirect("/");
    }else{
   usuario.getUserbyEmail(req.query.id, (user) =>{
        res.render('contactarProf', {nombre: user[0].nombre, apellido: user[0].apellido, id: req.query.id});
    }, (error) =>{
        console.log("Hubo un error inesperado : "+error);
    });
    }
});

/*
* Envia a la funcion enviarMensaje los parametros del mensaje que fue enviado
*/
app.post("/enviarMensaje", (req, res) =>{
    mensaje.enviarMensaje(req.session.user, req.body.idReceptor, req.body.mensaje);
});

/*
* Renderiza la vista mensajeEnviado, que redirige al home tras unos segundos
*/
app.get("/mensajeEnviado", (req, res) =>{
    console.log(req.session.profesional);
    res.render("mensajeEnviado");
    
});

/*
* En caso de ser profesional, se agrega esta vista, que muestra todos los mensajes que haya recibido
*/
app.get("/verMensajes", (req, res) =>{
    
    if(req.session.user == undefined){
        res.redirect('/');
    }else{
        mensaje.getMensajes(req.session.user, (mensajes) =>{
            console.log(mensajes);
            usuario.getUserbyEmail(req.session.user, (user) =>{
                res.render('verMensajes',{nombre:user[0].nombre,
                                            apellido: user[0].apellido,
                                            mensajes: mensajes,
                                        });
            });
        })
        
    }
});