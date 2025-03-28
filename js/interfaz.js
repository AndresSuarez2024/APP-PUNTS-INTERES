// js/Interfaz.js
export class Interfaz {
    constructor() {
        this.listaPuntos = document.getElementById("lista-puntos");
        this.totalElementos = document.getElementById("total");
        this.tipoSelect = document.getElementById("tipo");
        this.ordenSelect = document.getElementById("orden");
        this.searchInput = document.getElementById("search");
        this.clearButton = document.getElementById("clear");
        this.dropZone = document.getElementById("drop-zone");
    }

    mostrarListaPuntos(puntos) {
        this.listaPuntos.innerHTML = "";
        puntos.forEach((punto, index) => {
            let li = document.createElement("li");
            li.textContent = `${punto.nombre} (${punto.ubicacion}, ${punto.pais}) - Tipo: ${punto.tipo} - Capacidad: ${punto.capacidad}`;

            let btnEliminar = document.createElement("button");
            btnEliminar.textContent = "Eliminar";
            btnEliminar.onclick = () => this.eliminarPunto(index);
            li.appendChild(btnEliminar);

            this.listaPuntos.appendChild(li);
        });

        this.totalElementos.textContent = `Número total: ${puntos.length}`;
    }

    eliminarPunto(index) {
        if (confirm("¿Quieres eliminar el punto de interés?")) {
            this.eliminarPuntoCallback(index);
        }
    }

    setEliminarPuntoCallback(callback) {
        this.eliminarPuntoCallback = callback;
    }
}
