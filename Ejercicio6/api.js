function buscar(idioma) {
    const tema = document.getElementById("tema").value.trim();
    const date = document.getElementById("date").value.trim();
    const pais = document.getElementById("pais").value;

    if (!tema || !date || !pais) {
        alert("Por favor ingresa un tema, un año y un país");
        return;
    }

    const url = `http://api.redalyc.org/search/subject(${tema}),date(${date}),country(${pais}),language(${idioma}),page(10),sizePage(10)/output(json)/download(yes)/token(a3FvS2ZMNGRodS9kZ1EzUVlSSDBsdz09)`;

    fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }
        return response.json();
    })  
    .then(json => {        
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
                // Solo mostrar claves mapeadas y valores válidos
                if (clavesMapeadas[clave]) {
                    
                    if (valor !== null && valor !== undefined) {
                        let valorTexto = Array.isArray(valor) ? valor.join(", ") : String(valor).trim();
                        
                        if (valorTexto.toLowerCase() !== "unknown" && valorTexto.toLowerCase() !== "null") {
                            if (clave === "dc_relation") {
                                contenido += `<p><strong>${clavesMapeadas[clave]}:</strong> <a href="${valorTexto}" target="_blank">${valorTexto}</a></p>`;
                            } else if (clave === "dc_title") {
                                contenido += `<center><h3>${valorTexto}</h3></center><br>`;
                            } else {
                                contenido += `<p><strong>${clavesMapeadas[clave]}:</strong> ${valorTexto}</p>`;
                            }
                        }
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
    document.getElementById("contenedor-tarjetas").innerHTML = "<p>Error al obtener los datos o no existen registros.</p>";
});
}