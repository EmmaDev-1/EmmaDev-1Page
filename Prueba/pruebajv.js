const contenedorPrevisualizacion = document.getElementById("previsualizacion");
        const botonDescargar = document.getElementById("botonDescargar");

        // Mostrar el botón cuando el puntero entra en el contenedor de previsualización
        contenedorPrevisualizacion.addEventListener("mouseenter", function() {
            botonDescargar.style.display = "block";
        });

        // Ocultar el botón cuando el puntero sale del contenedor de previsualización
        contenedorPrevisualizacion.addEventListener("mouseleave", function() {
            botonDescargar.style.display = "none";
        });

        let imagenActual = 1; // Inicialmente, muestra la imagen 1

function cambiarImagen() {
    const imagen = document.getElementById("imagen");

    if (imagenActual === 1) {
        imagen.src = "IG.jpg"; // Cambia a la imagen 2
        imagen.alt = "IG.jpg";
        imagenActual = 2;
    } else {
        imagen.src = "emma.jpeg"; // Cambia de nuevo a la imagen 1
        imagen.alt = "emma.jpeg";
        imagenActual = 1;
    }
}