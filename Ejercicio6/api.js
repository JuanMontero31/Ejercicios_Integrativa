function buscar(idioma = "") {
    const tema = document.getElementById("tema").value.trim();
    const date = document.getElementById("date").value.trim();
    const pais = document.getElementById("pais").value;

    if (!tema) {
        alert("Por favor ingresa un tema");
        return;
    }

    let filtros = [`subject(${tema})`];
    if (date) filtros.push(`date(${date})`);
    if (pais) filtros.push(`country(${pais})`);
    if (idioma) filtros.push(`language(${idioma})`);

    const filtrosURL = filtros.join(",");
    const url = `http://api.redalyc.org/search/${filtrosURL},page(10),sizePage(10)/output(json)/download(yes)/token(a3FvS2ZMNGRodS9kZ1EzUVlSSDBsdz09)`;

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

        let idCounter = 0;

        if (json.searchRetrieveResponse.records.length > 0) {
            json.searchRetrieveResponse.records.forEach((registro) => {
                const tarjeta = document.createElement("div");
                tarjeta.classList.add("tarjeta");

                let contenido = "";


                Object.entries(registro.recordData).forEach(([clave, valor]) => {
                    if (clavesMapeadas[clave] && valor !== null && valor !== undefined) {
                        let valorTexto = Array.isArray(valor) ? valor.join(", ") : String(valor).trim();
                        
                        if (valorTexto.toLowerCase() !== "unknown" && valorTexto.toLowerCase() !== "null") {
                            if (clave === "dc_relation") {
                                contenido += `<p><strong>${clavesMapeadas[clave]}:</strong> <a href="${valorTexto}" target="_blank">${valorTexto}</a></p>`;
                            } else if (clave === "dc_title") {
                                contenido += `<center><h3>${valorTexto}</h3></center><br>`;
                            } else if (clave === "dc_description") {
                                const textoCorto = valorTexto.substring(0, 100);
                                const idDescripcion = `desc-${idCounter++}`;
                            
                                // Escapar las comillas que pueden romper el HTML
                                const textoSeguro = valorTexto.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/"/g, '&quot;');
                            
                                if (valorTexto.length > 100) {
                                    contenido += `
                                        <p>
                                            <strong>${clavesMapeadas[clave]}:</strong> 
                                            <span id="${idDescripcion}">${textoCorto}...</span>
                                            <button class="ver" onclick="toggleDescripcion('${idDescripcion}', \`${textoSeguro}\`, this)">Ver más</button>
                                        </p>
                                    `;
                                } else {
                                    contenido += `
                                        <p>
                                            <strong>${clavesMapeadas[clave]}:</strong> 
                                            <span>${valorTexto}</span>
                                        </p>
                                    `;
                                }
                            }else {
                                contenido += `<p><strong>${clavesMapeadas[clave]}:</strong> ${valorTexto}</p>`;
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


function toggleDescripcion(id, textoCompleto, boton) {
    const span = document.getElementById(id);
    if (boton.textContent === "Ver más") {
        span.textContent = textoCompleto;
        boton.textContent = "Ver menos";
    } else {
        span.textContent = textoCompleto.substring(0, 100) + "...";
        boton.textContent = "Ver más";
    }
}

document.getElementById("btnBuscarTema").addEventListener("click", function () {
    buscar(); // sin idioma
});
document.getElementById("tema").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault(); 
        buscar(); 
    }
});
document.getElementById("date").addEventListener("change", function () {
    buscar(); // Se ejecuta búsqueda al seleccionar fecha
});

document.getElementById("pais").addEventListener("change", function () {
    buscar(); // Se ejecuta búsqueda al seleccionar país
});

