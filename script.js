document.addEventListener("DOMContentLoaded", () => {  // Espera a que el documento se cargue completamente antes de ejecutar el código
    let map = L.map('map').setView([0, 0], 2);  // Crea un mapa centrado en las coordenadas (0, 0) con un zoom de nivel 2
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {  // Añade una capa de mosaico de OpenStreetMap
        attribution: '© OpenStreetMap contributors'  // Atribución a los contribuyentes de OpenStreetMap
    }).addTo(map);  // Añade la capa al mapa


    const dropZone = document.getElementById("drop-zone");  // Obtiene el elemento donde se puede arrastrar el archivo
    const listaPuntos = document.getElementById("lista-puntos");  // Obtiene la lista donde se mostrarán los puntos de interés
    const totalElementos = document.getElementById("total");  // Obtiene el elemento que muestra el total de puntos
    const tipoSelect = document.getElementById("tipo");  // Obtiene el select para filtrar por tipo de punto
    const ordenSelect = document.getElementById("orden");  // Obtiene el select para ordenar los puntos
    const searchInput = document.getElementById("search");  // Obtiene el campo de búsqueda
    let puntosInteres = [];  // Array que almacenará los puntos de interés
    let markers = new L.LayerGroup().addTo(map);  // Grupo de capas para los marcadores en el mapa

    dropZone.addEventListener("dragover", e => {  // Evento cuando se arrastra un archivo sobre la zona de carga
        e.preventDefault();  // Previene la acción por defecto del navegador
    });

    dropZone.addEventListener("drop", e => {  // Evento cuando se deja un archivo en la zona de carga
        e.preventDefault();  // Previene la acción por defecto del navegador
        let file = e.dataTransfer.files[0];  // Obtiene el primer archivo arrastrado
        if (file && file.type === "text/csv") {  // Si el archivo es un CSV
            leerCSV(file);  // Llama a la función para leer el archivo CSV
        } else {
            alert("El fichero no es csv");  // Muestra una alerta si el archivo no es CSV
        }
    });

    function leerCSV(file) {  // Función para leer el archivo CSV
        const reader = new FileReader();  // Crea un lector de archivos
        reader.onload = e => {  // Cuando el archivo se carga correctamente
            const lines = e.target.result.split("\n").slice(1);  // Divide el contenido en líneas y omite la primera línea (encabezado)
            puntosInteres = lines.map(line => {  // Mapea cada línea a un objeto de punto de interés
                const [nombre, tipo, pais, capacidad, ubicacion, codi, lat, lng, imagenEstadio] = line.split(",");  // Divide la línea por comas
                if (!nombre || !tipo || !pais || !lat || !lng || !capacidad) {  // Si falta algún dato esencial, lo descarta
                    return null;
                }
                return {  // Devuelve un objeto con los datos del punto de interés
                    nombre, 
                    tipo, 
                    pais, 
                    capacidad: parseInt(capacidad),  // Convierte la capacidad a un número entero
                    ubicacion, 
                    codi, 
                    lat: parseFloat(lat),  // Convierte la latitud a un número flotante
                    lng: parseFloat(lng),  // Convierte la longitud a un número flotante
                    imagenEstadio 
                };
            }).filter(Boolean);  // Filtra los valores null
            mostrarPuntos();  // Llama a la función para mostrar los puntos de interés
        };
        reader.readAsText(file);  // Lee el archivo como texto
    }

    function obtenerBandera(pais) {  // Función para obtener la URL de la bandera de un país
        const paises = {  // Mapa de países y sus códigos de bandera
            "España": "es",
            "Reino Unido": "gb",
            "Portugal": "pt",
            "Brasil": "br",
            "Alemania": "de",
            "México": "mx",
            "Rusia": "ru"
        };
        return `https://flagcdn.com/w320/${paises[pais] || 'us'}.png`;  // Devuelve la URL de la bandera del país o la de Estados Unidos por defecto
    }

    function mostrarPuntos() {  // Función para mostrar los puntos de interés en la lista y en el mapa
        let filteredPoints = puntosInteres.filter(punto => {  // Filtra los puntos que coinciden con el texto de búsqueda
            return punto.nombre.toLowerCase().includes(searchInput.value.toLowerCase());
        });

        if (tipoSelect.value) {  // Si se ha seleccionado un país para filtrar
            filteredPoints = filteredPoints.filter(punto => punto.pais.toLowerCase() === tipoSelect.value.toLowerCase());
        }

        if (ordenSelect.value === "asc") {  // Si se ha seleccionado ordenar de manera ascendente por capacidad
            filteredPoints.sort((a, b) => a.capacidad - b.capacidad);
        } else if (ordenSelect.value === "desc") {  // Si se ha seleccionado ordenar de manera descendente por capacidad
            filteredPoints.sort((a, b) => b.capacidad - a.capacidad);
        }

        listaPuntos.innerHTML = "";  // Limpia la lista de puntos de interés
        markers.clearLayers();  // Limpia los marcadores del mapa

        filteredPoints.forEach((punto, index) => {  // Recorre los puntos filtrados
            let li = document.createElement("li");  // Crea un nuevo elemento <li> para la lista
            li.textContent = `${punto.nombre} (${punto.ubicacion}, ${punto.pais}) - Tipo: ${punto.tipo} - Capacidad: ${punto.capacidad}`;  // Muestra información del punto

            let bandera = document.createElement("img");  // Crea una imagen para la bandera
            bandera.src = obtenerBandera(punto.pais);  // Asigna la URL de la bandera
            bandera.alt = `Bandera de ${punto.pais}`;  // Asigna un texto alternativo para la imagen
            bandera.style.width = "20px";  // Establece el tamaño de la bandera
            bandera.style.marginRight = "10px";  // Agrega margen a la derecha de la bandera

            li.prepend(bandera);  // Coloca la bandera al principio del <li>

            if (punto.imagenEstadio) {  // Si hay imagen del estadio, la agrega
                let imagenEstadio = document.createElement("img");
                imagenEstadio.src = punto.imagenEstadio;
                imagenEstadio.alt = `Imagen de ${punto.nombre}`;
                imagenEstadio.style.width = "100px";  // Establece el tamaño de la imagen
                imagenEstadio.style.marginLeft = "10px";  // Agrega margen a la izquierda de la imagen
                li.appendChild(imagenEstadio);  // Agrega la imagen del estadio al <li>
            }

            let btnEliminar = document.createElement("button");  // Crea un botón de eliminar
            btnEliminar.textContent = "Eliminar";  // Establece el texto del botón
            btnEliminar.onclick = () => eliminarPunto(index);  // Asocia la función de eliminar al botón
            li.appendChild(btnEliminar);  // Agrega el botón al <li>
            listaPuntos.appendChild(li);  // Agrega el <li> a la lista de puntos

            let marker = L.marker([punto.lat, punto.lng]).addTo(markers)  // Añade un marcador en el mapa
                .bindPopup(`
                    <b>${punto.nombre}</b><br>
                    <img src="${obtenerBandera(punto.pais)}" alt="Bandera de ${punto.pais}" style="width: 30px;"> ${punto.pais}<br>
                    Tipo: ${punto.tipo}<br>
                    Capacidad: ${punto.capacidad}<br>
                    <img src="${punto.imagenEstadio}" alt="Imagen de ${punto.nombre}" style="width: 150px;">
                `);  // Muestra información del punto en un popup
        });

        totalElementos.textContent = `Número total: ${filteredPoints.length}`;  // Muestra el número total de puntos filtrados
    }

    function eliminarPunto(index) {  // Función para eliminar un punto de interés
        if (confirm("¿Estás seguro de que quieres eliminar el punto de interés?")) {  // Pide confirmación al usuario
            puntosInteres.splice(index, 1);  // Elimina el punto de interés del array
            mostrarPuntos();  // Actualiza la lista de puntos
        }
    }

    document.getElementById("clear").addEventListener("click", () => {  // Evento para el botón de limpiar
        puntosInteres = [];  // Limpia el array de puntos de interés
        listaPuntos.innerHTML = "<p>No hay información que mostrar</p>";  // Muestra un mensaje si no hay puntos
        totalElementos.textContent = "Número total: 0";  // Muestra que no hay puntos
        markers.clearLayers();  // Limpia los marcadores del mapa
        searchInput.value = "";  // Limpia el campo de búsqueda
        tipoSelect.value = "";  // Restablece el filtro de tipo
        ordenSelect.value = "asc";  // Restablece el orden a ascendente
    });

    tipoSelect.addEventListener("change", () => {  // Evento cuando cambia el filtro de tipo
        mostrarPuntos();  // Muestra los puntos con el filtro actualizado
    });

    ordenSelect.addEventListener("change", () => {  // Evento cuando cambia el filtro de orden
        mostrarPuntos();  // Muestra los puntos con el filtro actualizado
    });

    searchInput.addEventListener("input", () => {  // Evento cuando se escribe en el campo de búsqueda
        mostrarPuntos();  // Muestra los puntos con la búsqueda actualizada
    });
});
