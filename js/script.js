// JavaScript Document

var arrUsuarios=[{id:1,nombre:"Nacho"},{id:2,nombre:"Diego"},{id:3,nombre:"Juan"}];

var arrPosts=[
{id:1,idUsuario:1,titulo:"Titulo 1",texto:"Este es el texto 1"},
{id:2,idUsuario:1,titulo:"Titulo 2",texto:"Este es el texto 2"},
{id:3,idUsuario:1,titulo:"Titulo 3",texto:"Este es el texto 3"},
{id:4,idUsuario:2,titulo:"Titulo 4",texto:"Este es el texto 4"},
{id:5,idUsuario:2,titulo:"Titulo 5",texto:"Este es el texto 5"},
{id:6,idUsuario:2,titulo:"Titulo 6",texto:"Este es el texto 6"},
{id:7,idUsuario:3,titulo:"Titulo 7",texto:"Este es el texto 7"},
];

var arrComentarios=[
{idPost:1, texto:"Este es el Comentario 1"},
{idPost:1, texto:"Este es el Comentario 2"},
{idPost:2, texto:"Este es el Comentario 1"},
{idPost:3, texto:"Este es el Comentario 1"},
{idPost:3, texto:"Este es el Comentario 2"},
{idPost:4, texto:"Este es el Comentario 1"},
{idPost:5, texto:"Este es el Comentario 1"},
{idPost:5, texto:"Este es el Comentario 2"},
{idPost:6, texto:"Este es el Comentario 1"},
{idPost:7, texto:"Este es el Comentario 1"},
{idPost:7, texto:"Este es el Comentario 2"},
]


for(var i=0;i<arrUsuarios.length;i++){
	var boton = document.createElement('button');
	var textoBoton = document.createTextNode(arrUsuarios[i].nombre);
	boton.appendChild(textoBoton);
	boton.setAttribute('id',arrUsuarios[i].id);
	boton.setAttribute('onclick','listarPosts('+arrUsuarios[i].id+')');
	document.getElementById('contenedor-botones').appendChild(boton);
};

function listarPosts(idAutor){
	var tabla = document.createElement('table');
	var fila = document.createElement('tr');
	var columnaTitulo = document.createElement('td');
	var columnaTexto = document.createElement('td');

	for(var i=0;i<arrPosts.length;i++){
		if (arrPosts[i].idUsuario==idAutor){
		var fila = document.createElement('tr');
		fila.document.setAttribute('id',arrPosts[i].idUsuario);
		var columnaTitulo = document.createElement('td');
		var columnaTexto = document.createElement('td');	
		var tituloPost = document.createTextNode(arrPosts[i].titulo);
		var textoPost = document.createTextNode(arrPosts[i].texto);
		columnaTitulo.appendChild(tituloPost);
		columnaTexto.appendChild(textoPost);
		fila.appendChild(columnaTitulo);
		fila.appendChild(columnaTexto);
		tabla.setAttribute('class','tabla-posts');
		tabla.appendChild(fila);
		}
	}

	var posts = document.createElement('div');
	document.body.appendChild(posts);
	posts.appendChild(tabla);
}