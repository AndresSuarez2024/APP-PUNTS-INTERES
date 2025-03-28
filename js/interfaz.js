class Interfaz {
    constructor() {
        this.listaPuntos = document.getElementById("lista-puntos");
        this.totalElementos = document.getElementById("total");
        this.tipoSelect = document.getElementById("tipo");
        this.ordenSelect = document.getElementById("orden");
        this.searchInput = document.getElementById("search");
        this.clearButton = document.getElementById("clear");
        this.dropZone = document.getElementById("drop-zone");
    }

    mostrarListaPuntos(puntos, mapa) {
        this.listaPuntos.innerHTML = "";
        puntos.forEach((punto, index) => {
            let li = document.createElement("li");
            li.textContent = `${punto.nombre} (${punto.ubicacion}, ${punto.pais}) - Tipo: ${punto.tipo} - Capacidad: ${punto.capacidad}`;

            let bandera = this.crearBandera(punto.pais);
            li.prepend(bandera);

            if (punto.imagenEstadio) {
                let imagenEstadio = this.crearImagen(punto.imagenEstadio);
                li.appendChild(imagenEstadio);
            }

            let btnEliminar = document.createElement("button");
            btnEliminar.textContent = "Eliminar";
            btnEliminar.onclick = () => this.eliminarPunto(index);
            li.appendChild(btnEliminar);

            this.listaPuntos.appendChild(li);

            let popupContent = `
                <b>${punto.nombre}</b><br>
                <img src="${this.obtenerBandera(punto.pais)}" alt="Bandera de ${punto.pais}" style="width: 30px;"> ${punto.pais}<br>
                Tipo: ${punto.tipo}<br>
                Capacidad: ${punto.capacidad}<br>
                <img src="${punto.imagenEstadio}" alt="Imagen de ${punto.nombre}" style="width: 150px;">
            `;
            mapa.agregarMarcador(punto.lat, punto.lng, popupContent);
        });

        this.totalElementos.textContent = `Número total: ${puntos.length}`;
    }

    crearBandera(pais) {
        let bandera = document.createElement("img");
        bandera.src = this.obtenerBandera(pais);
        bandera.alt = `Bandera de ${pais}`;
        bandera.style.width = "20px";
        bandera.style.marginRight = "10px";
        return bandera;
    }

    crearImagen(src) {
        let imagenEstadio = document.createElement("img");
        imagenEstadio.src = src;
        imagenEstadio.alt = "Imagen del estadio";
        imagenEstadio.style.width = "100px";
        imagenEstadio.style.marginLeft = "10px";
        return imagenEstadio;
    }

    obtenerBandera(pais) {
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

    eliminarPunto(index) {
        if (confirm("¿Quieres eliminar el punto de interés?")) {
            // Se elimina el punto de interés (esto debe ser manejado por la clase de PuntosDeInteres)
            // Aquí solo invocaríamos el método eliminarPunto en el controlador principal
        }
    }
}
