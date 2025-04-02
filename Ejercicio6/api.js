
fetch('http://api.redalyc.org/search/country(Brasil),page(10),sizePage(10)/output(json)/download(yes)/token(a3FvS2ZMNGRodS9kZ1EzUVlSSDBsdz09)')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }
        return response.json();
    })  
    .then(json => {        
        // Obtener el contenedor donde agregaremos las tarjetas
        const contenedorTarjetas = document.getElementById("contenedor-tarjetas");
        contenedorTarjetas.innerHTML = "";

        const clavesMapeadas = {
            "dc_title": "Título",
            "dc_creator": "Creador",
            "dc_subject": "Tema",
            "dc_description": "Descripción",
            "dc_date": "Fecha",
            "dc_relation": "URL"
        };

       // Verificar si hay registros disponibles
       if (json.searchRetrieveResponse.records.length > 0) {
        json.searchRetrieveResponse.records.forEach((registro, index) => {
            // Crear la tarjeta
            const tarjeta = document.createElement("div");
            tarjeta.classList.add("tarjeta");

            // Crear contenido de la tarjeta
            let contenido = "";
            Object.entries(registro.recordData).forEach(([clave, valor]) => {
                // Solo mostrar claves mapeadas y sus valores
                if (clavesMapeadas[clave]) {
                    if (clave === "dc_relation" && valor) {
                        // Diseño para el enlace
                        contenido += `<p><strong>${clavesMapeadas[clave]}:</strong> <a href="${valor}" target="_blank">${valor}</a></p>`;
                    } else if (clave === "dc_title" && valor){
                        // Diseño para el titulo
                        contenido += `<center><h3>${valor}</h3></center><br>`;
                    }
                    else {
                        // Si no es un enlace, simplemente mostramos el valor
                        contenido += `<p><strong>${clavesMapeadas[clave]}:</strong> ${valor}</p>`;
                    }
                }
            });

            tarjeta.innerHTML = contenido;
            contenedorTarjetas.appendChild(tarjeta);
        });
    } else {
        contenedorTarjetas.innerHTML = "<p>No se encontraron registros.</p>";
    }
})
.catch(err => {
    console.error('Solicitud fallida', err);
    document.getElementById("contenedor-tarjetas").innerHTML = "<p>Error al obtener los datos.</p>";
});