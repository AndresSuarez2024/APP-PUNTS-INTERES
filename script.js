document.addEventListener("DOMContentLoaded", () => {  
    let map = L.map('map').setView([0, 0], 2);  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {  
        attribution: '© OpenStreetMap contributors'
    }).addTo(map); 


    const dropZone = document.getElementById("drop-zone"); 
    const listaPuntos = document.getElementById("lista-puntos");  
    const totalElementos = document.getElementById("total"); 
    const tipoSelect = document.getElementById("tipo"); 
    const ordenSelect = document.getElementById("orden"); 
    const searchInput = document.getElementById("search"); 
    let puntosInteres = []; 
    let markers = new L.LayerGroup().addTo(map); 

    dropZone.addEventListener("dragover", e => {
        e.preventDefault(); 
    });

    dropZone.addEventListener("drop", e => { 
        e.preventDefault(); 
        let file = e.dataTransfer.files[0];
        if (file && file.type === "text/csv") { 
            leerCSV(file); 
        } else {
            alert("El fichero no es csv");
        }
    });

    function leerCSV(file) {  
        const reader = new FileReader(); 
        reader.onload = e => { 
            const lines = e.target.result.split("\n").slice(1);
            puntosInteres = lines.map(line => { 
                const [nombre, tipo, pais, capacidad, ubicacion, codi, lat, lng, imagenEstadio] = line.split(","); 
                if (!nombre || !tipo || !pais || !lat || !lng || !capacidad) { 
                    return null;
                }
                return { 
                    nombre, 
                    tipo, 
                    pais, 
                    capacidad: parseInt(capacidad), 
                    ubicacion, 
                    codi, 
                    lat: parseFloat(lat),  
                    lng: parseFloat(lng), 
                    imagenEstadio 
                };
            }).filter(Boolean); 
            mostrarPuntos(); 
        };
        reader.readAsText(file); 
    }

    function obtenerBandera(pais) { 
        const paises = { 
            "España": "es",
            "Reino Unido": "gb",
            "Portugal": "pt",
            "Brasil": "br",
            "Alemania": "de",
            "México": "mx",
            "Rusia": "ru"
        };
        return `https://flagcdn.com/w320/${paises[pais] || 'us'}.png`;  
    }

    function mostrarPuntos() { 
        let filteredPoints = puntosInteres.filter(punto => { 
            return punto.nombre.toLowerCase().includes(searchInput.value.toLowerCase());
        });

        if (tipoSelect.value) {  
            filteredPoints = filteredPoints.filter(punto => punto.pais.toLowerCase() === tipoSelect.value.toLowerCase());
        }

        if (ordenSelect.value === "asc") { 
            filteredPoints.sort((a, b) => a.capacidad - b.capacidad);
        } else if (ordenSelect.value === "desc") {  
            filteredPoints.sort((a, b) => b.capacidad - a.capacidad);
        }

        listaPuntos.innerHTML = ""; 
        markers.clearLayers(); 

        filteredPoints.forEach((punto, index) => { 
            let li = document.createElement("li");  
            li.textContent = `${punto.nombre} (${punto.ubicacion}, ${punto.pais}) - Tipo: ${punto.tipo} - Capacidad: ${punto.capacidad}`;  
            let bandera = document.createElement("img");  
            bandera.src = obtenerBandera(punto.pais); 
            bandera.alt = `Bandera de ${punto.pais}`; 
            bandera.style.width = "20px"; 
            bandera.style.marginRight = "10px";

            li.prepend(bandera);  

            if (punto.imagenEstadio) { 
                let imagenEstadio = document.createElement("img");
                imagenEstadio.src = punto.imagenEstadio;
                imagenEstadio.alt = `Imagen de ${punto.nombre}`;
                imagenEstadio.style.width = "100px"; 
                imagenEstadio.style.marginLeft = "10px";  
                li.appendChild(imagenEstadio); 
            }

            let btnEliminar = document.createElement("button"); 
            btnEliminar.textContent = "Eliminar";  
            btnEliminar.onclick = () => eliminarPunto(index); 
            li.appendChild(btnEliminar);  
            listaPuntos.appendChild(li);  

            let marker = L.marker([punto.lat, punto.lng]).addTo(markers)  
                .bindPopup(`
                    <b>${punto.nombre}</b><br>
                    <img src="${obtenerBandera(punto.pais)}" alt="Bandera de ${punto.pais}" style="width: 30px;"> ${punto.pais}<br>
                    Tipo: ${punto.tipo}<br>
                    Capacidad: ${punto.capacidad}<br>
                    <img src="${punto.imagenEstadio}" alt="Imagen de ${punto.nombre}" style="width: 150px;">
                `);  
        });

        totalElementos.textContent = `Número total: ${filteredPoints.length}`; 
    }

    function eliminarPunto(index) {  
        if (confirm("¿Estás seguro de que quieres eliminar el punto de interés?")) {  
            puntosInteres.splice(index, 1);  
            mostrarPuntos(); 
        }
    }

    document.getElementById("clear").addEventListener("click", () => {  
        puntosInteres = [];  
        listaPuntos.innerHTML = "<p>No hay información que mostrar</p>"; 
        totalElementos.textContent = "Número total: 0";  
        markers.clearLayers();  
        searchInput.value = "";  
        tipoSelect.value = "";  
        ordenSelect.value = "asc";  
    });

    tipoSelect.addEventListener("change", () => {  
        mostrarPuntos(); 
    });

    ordenSelect.addEventListener("change", () => {  
        mostrarPuntos();  
    });

    searchInput.addEventListener("input", () => {  
        mostrarPuntos();  
    });
});
