const url = "https://jsonplaceholder.typicode.com/users";
const tabla = document.getElementById("tabla-usuarios");
const mensaje = document.getElementById("mensaje");
const contador = document.querySelector("contador-mordidos");

const CLAVE = "usuariosMordidos";
let totalUsuarios = 0;
const filas = new Map(); // id del usuario -> fila de la tabla

//Recuperar los ids marcados desde LocalStorage
function cargarMordidos() {
    const guardado = localStorage.getItem(CLAVE);
    if (guardado === null) return [];
    try {
        const lista = JSON.parse(guardado);
        return Array.isArray(lista) ? lista : [];
    } catch {
        return [];
    }
}

let mordidos = cargarMordidos();

function guardarMordidos() {
    localStorage.setItem(CLAVE, JSON.stringify(mordidos));
}

function actualizarContador() {
    contador.actualizar(mordidos.length, totalUsuarios);
}

//Marcar o desmarcar un usuario
function alternarMordido(id) {
    const fila = filas.get(id);
    const yaMordido = mordidos.includes(id);

    mordidos = yaMordido ? mordidos.filter((m) => m !== id) : [...mordidos, id];
    fila.classList.toggle("mordido", !yaMordido);
    fila.querySelector("button").setAttribute("aria-pressed", String(!yaMordido));

    guardarMordidos();
    actualizarContador();
}

//Escuchar el evento personalizado del Web Component
contador.addEventListener("limpiar-marcas", () => {
    mordidos = [];
    guardarMordidos();
    filas.forEach((fila) => {
        fila.classList.remove("mordido");
        fila.querySelector("button").setAttribute("aria-pressed", "false");
    });
    actualizarContador();
});

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

            //Restaurar la marca guardada
            if (mordidos.includes(usuario.id)) {
                fila.classList.add("mordido");
                boton.setAttribute("aria-pressed", "true");
            }

            filas.set(usuario.id, fila);
            tabla.appendChild(fila);
        });

        actualizarContador();

        //Mensaje de éxito en consola
        console.log("Los datos fueron obtenidos correctamente de:", url);
    })
    .catch((error) => {
        //Manejo de errores (HTTP, red, JSON inválido, etc.)
        console.log("No fue posible consultar los usuarios.", error.message);
        mensaje.className = "error";
        mensaje.textContent = `No fue posible cargar los usuarios: ${error.message}`;
    });
