const urlObtenerUsuarios = 'http://localhost/CRUD/api/obtenerUsuarios.php'
const urlAgregarUsuario = 'http://localhost/CRUD/api/agregarUsuario.php'
const urlEditarUsuario = 'http://localhost/CRUD/api/editarUsuario.php'
const urlBorrarUsuario = 'http://localhost/CRUD/api/borrarUsuario.php'

//Variable que almacena la lista de empleados inicializada en un array vacio
let listaEmpleados = [];

//Objeto que inicializa los valores en 0 donde se almacenara la información en el formulario y enviarla al backend
const objEmpleado = {
    idUsuario: '',
    usuario: '',
    contrasena: '',
    email: ''
}

//Bandera para definir si se agregara un usuario o se editara
let editando = false

//Variables con elementos de html de los input
const formulario = document.querySelector('#formulario')
const usuarioInput = document.querySelector('#usuario')
const contrasenaInput = document.querySelector('#contrasena')
const emailInput = document.querySelector('#email')

//Captura de evento submit de formulario e invocación de la función validdar formulario
formulario.addEventListener('submit',validarFormulario)

//Función validar formulario
function validarFormulario(e){
    e.preventDefault() //Prevenir que se ejecute en automatico

    //Validamos que los campos del formulario esten llenos
    if([usuarioInput.value, contrasenaInput.value, emailInput.value].includes('')){
        alert('Tienes que llenar los campos')
        return

    }

    //Agregamos las funciones de editar y agregar
    if(editando){ //Si la variable editando es verdadera mandamos a llamar a la funcion de editarEmpleado
        editarEmpleado() 
        editando = false //Y la regresamos a false
    }

    else {  //Si la variable editando esta en false vamos a crear otro registro
        objEmpleado.idUsuario = Date.now() //Llenamos el objeto donde habiamos inicializado la informacion del formulario "Date.now solo es para llenar el campo"
        objEmpleado.usuario = usuarioInput.value
        objEmpleado.contrasena = contrasena.value
        objEmpleado.email = email.value

        agregarEmpleado()

    }
}

//Función para mostrar lo que tenemos dentro de la Base de Datos
async function obtenerEmpleados(){
    listaEmpleados = await fetch(urlObtenerUsuarios) //Igualamos la variable listaEmpleados con el resultado obtenido a traves de la API
    .then(respuesta => respuesta.json()) //Hacemos que transforme la respuesta en JSON
    .then(datos => datos) //Colocamos los datos en la lista de elementos
    .catch(error => console.log(error))//Catch en caso de que exista algún error

    mostrarEmpledos() //Llamamos la función para mostrar los resultados en HTML 

}

obtenerEmpleados() //Llamamos la función para que al cargar la página se muestren los empleados

//Función para mostrar los empleados en HTML
function mostrarEmpledos(){
    const divEmpleados = document.querySelector('.div-empleados')//Constante la cual contiene el div donde se mostraran los empleados
    listaEmpleados.forEach(empleado => {
        const {idUsuario, usuario, contrasena, email} = empleado

        const parrafo = document.createElement('p') //Se crea un elemento HTML para colocar la información
        parrafo.textContent = `${idUsuario} - ${usuario} - ${contrasena} - ${email}`
        parrafo.dataset.id = idUsuario //Identificador para cada fila con el id del usuario

        const editarBoton = document.createElement('button') //Cremos el boton de editar
        editarBoton.onclick = () => cargarEmpleado(empleado) //Instrucción de accionamiento del botón si este es activado
        editarBoton.textContent = 'Editar'
        editarBoton.classList.add('btn' , 'btn-editar') //Colocamos clases para el boton de editar
        parrafo.append(editarBoton) //Lo agregamos al parrafo

        const eliminarBoton = document.createElement('button') //Creamos un boton para eliminar el registro
        eliminarBoton.onclick = () => eliminarEmpleado(idUsuario)
        eliminarBoton.textContent = 'Eliminar'
        eliminarBoton.classList.add('btn', 'btn-eliminar') //Colocamos la clase correspondiente al boton para eliminar
        parrafo.append(eliminarBoton) //Agregamos el boton para eliminar al parrafo

        const hr = document.createElement('hr') //Agregamos un separador de linea horizontal
        
        //Agregamos el elemento al div
        divEmpleados.appendChild(parrafo)
        divEmpleados.appendChild(hr)



    })
}

//Función para agregar Empleado
async function agregarEmpleado(){
    const res = await fetch(urlAgregarUsuario,
        {
            method: 'POST', //Pasamos el metodo post
            body: JSON.stringify(objEmpleado) //Enviamos la información en forma de JSON
        })
        .then(respuesta => respuesta.json()) //Convertimos la respuesta en un json
        .then(data => data)
        .catch(error => alert(error))

        //Evaluamos el resultado de la respuesta enviada desde el PHP
        if(res.msg == 'OK'){
            alert('Se registro exitosamente') 
            limpiarHTML()   //Limpiamos el resultado 
            obtenerEmpleados() //Volvemos a obtener los empleados para actualizar la lista con el nuevo agregado

            formulario.reset() //Reiniciamos el formulario
            limpiarObjeto() //Limpiamos nuestros Inputs
        }
}

async function editarEmpleado(){ //Creamos la funcion para editar los empleados

    //Seteamos los valores que tenemos en el formulario
    objEmpleado.usuario = usuarioInput.value
    objEmpleado.contrasena = contrasenaInput.value
    objEmpleado.email = emailInput.value

    const res = await fetch(urlEditarUsuario,
        {
            method: 'POST',
            body: JSON.stringify(objEmpleado) //Convertimos la respuesta en un JSON
        })
        .then(respuesta => respuesta.json())//creamos una constante con la respuesta
        .then(data => data)
        .catch(error => alert(error))

    if (res.msg === 'OK'){ //Si todo marcho bien entonces mandamos una alerta para saber que los datos se actualizaron
        alert('Se actualizo correctamente')
        
        //Si todo sale bien llamamos a los metodos necesarios para limpiar todo
        limpiarHTML()
        obtenerEmpleados()
        formulario.reset()

        limpiarObjeto()
    }

    formulario.querySelector('button[type="submit"]').textContent = 'Agregar' //Regresamos el texto del boton a Agregar
    editando = false //Despues de haber editado, regresamos la variable a su estado inicial
}

//Creamos la función para eliminar registro
async function eliminarEmpleado(id){

    const res = await fetch(urlBorrarUsuario, //Convertimos el resultado en JSON 
        {
            method: 'POST',
            body: JSON.stringify({'idUsuario' : id})
        })

        .then(respuesta => respuesta.json())
        .then(data => data)
        .catch(error => alert(error))

        if(res.msg === 'OK'){
            alert ('Empleado eliminado existosamente')

            limpiarHTML()
            obtenerEmpleados()

            limpiarObjeto()
        }
    }

//Creamos la función para editar los registros
function cargarEmpleado(empleado){
    const {idUsuario, usuario, contrasena, email} = empleado //Desestructuramos el objeto recibido
    usuarioInput.value = usuario
    contrasenaInput.value = contrasena
    emailInput.value = email

    objEmpleado.idUsuario = idUsuario // Se setea el id para que se guarde en la variable y no se modifique en caso de edicion

    formulario.querySelector('button[type = "submit"').textContent = 'Actualizar' //Cambair el texto del boton en caso de que se quiera actualizar
    editando = true
}

//Creamos la funcion para limpiar el div
function limpiarHTML(){
    const divEmpleados = document.querySelector ('.div-empleados')//Obtenermos el contenedor de empleados
    while (divEmpleados.firstChild) { //Validamos si el div contiene hijos  y si es así lo eliminamos
        divEmpleados.removeChild(divEmpleados.firstChild)
    }
}

//Funcion para limpiar inputs

function limpiarObjeto(){
    objEmpleado.idUsuario = ''
    objEmpleado.usuario = ''
    objEmpleado.contrasena = ''
    objEmpleado.email = ''
}