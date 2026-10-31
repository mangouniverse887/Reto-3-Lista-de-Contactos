const url = "https://jsonplaceholder.typicode.com/users";
const tabla = document.getElementById("tabla-usuarios");
const mensaje = document.getElementById("mensaje");

const CLAVE = "usuariosMordidos";
let totalUsuarios = 0;
const filas = new Map(); // id del usuario -> fila de la tabla

//Ejecutar la consulta
fetch(url)
    //Recibir el objeto de la respuesta
    .then((response) => {
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        //Interpretar el cuerpo de la respuesta como JSON
        return response.json();
    })
    .then((usuarios) => {
        mensaje.textContent = "";
        totalUsuarios = usuarios.length;

        //Recorrer el arreglo y crear una fila por cada usuario
        usuarios.forEach((usuario) => {
            const fila = document.createElement("tr");

            //El nombre es un botón para poder marcarlo con mouse o teclado
            const nombre = document.createElement("td");
            nombre.dataset.label = "Nombre";
            const boton = document.createElement("button");
            boton.type = "button";
            boton.textContent = usuario.name;
            boton.setAttribute("aria-pressed", "false");
            boton.addEventListener("click", () => alternarMordido(usuario.id));
            nombre.appendChild(boton);

            const email = document.createElement("td");
            email.textContent = usuario.email;
            email.dataset.label = "Email";

            const telefono = document.createElement("td");
            telefono.textContent = usuario.phone;
            telefono.dataset.label = "Teléfono";

            //La empresa esta dentro de un objeto anidado
            const empresa = document.createElement("td");
            empresa.textContent = usuario.company.name;
            empresa.dataset.label = "Empresa";

            fila.appendChild(nombre);
            fila.appendChild(email);
            fila.appendChild(telefono);
            fila.appendChild(empresa);

            filas.set(usuario.id, fila);
            tabla.appendChild(fila);
        });

        //Mensaje de éxito en consola
        console.log("Los datos fueron obtenidos correctamente de:", url);
    })
    .catch((error) => {
        //Manejo de errores (HTTP, red, JSON inválido, etc.)
        console.log("No fue posible consultar los usuarios.", error.message);
        mensaje.className = "error";
        mensaje.textContent = `No fue posible cargar los usuarios: ${error.message}`;
    });