class PuntosDeInteres {
    constructor() {
        this.puntos = [];
    }

    cargarDesdeCSV(fileContent) {
        const lines = fileContent.split("\n").slice(1);
        this.puntos = lines.map(line => {
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
    }

    filtrarPuntos(searchText, tipo, orden) {
        let filteredPoints = this.puntos.filter(punto =>
            punto.nombre.toLowerCase().includes(searchText.toLowerCase())
        );

        if (tipo) {
            filteredPoints = filteredPoints.filter(punto => punto.pais.toLowerCase() === tipo.toLowerCase());
        }

        if (orden === "asc") {
            filteredPoints.sort((a, b) => a.capacidad - b.capacidad);
        } else if (orden === "desc") {
            filteredPoints.sort((a, b) => b.capacidad - a.capacidad);
        }

        return filteredPoints;
    }

    eliminarPunto(index) {
        this.puntos.splice(index, 1);
    }
}
