class Controlador {
    constructor() {
        this.mapa = new Mapa();
        this.puntosDeInteres = new PuntosDeInteres();
        this.interfaz = new Interfaz();
    }

    iniciar() {
        this.interfaz.dropZone.addEventListener("dragover", e => e.preventDefault());
        this.interfaz.dropZone.addEventListener("drop", this.handleFileDrop.bind(this));

        this.interfaz.tipoSelect.addEventListener("change", this.actualizarVista.bind(this));
        this.interfaz.ordenSelect.addEventListener("change", this.actualizarVista.bind(this));
        this.interfaz.searchInput.addEventListener("input", this.actualizarVista.bind(this));

        this.interfaz.clearButton.addEventListener("click", this.limpiarTodo.bind(this));
    }

    handleFileDrop(e) {
        e.preventDefault();
        let file = e.dataTransfer.files[0];
        if (file && file.type === "text/csv") {
            this.leerCSV(file);
        } else {
            alert("El fichero no es csv");
        }
    }

    leerCSV(file) {
        const reader = new FileReader();
        reader.onload = e => {
            this.puntosDeInteres.cargarDesdeCSV(e.target.result);
            this.actualizarVista();
        };
        reader.readAsText(file);
    }

    actualizarVista() {
        const puntosFiltrados = this.puntosDeInteres.filtrarPuntos(
            this.interfaz.searchInput.value,
            this.interfaz.tipoSelect.value,
            this.interfaz.ordenSelect.value
        );
        this.interfaz.mostrarListaPuntos(puntosFiltrados, this.mapa);
    }

    limpiarTodo() {
        this.puntosDeInteres.puntos = [];
        this.interfaz.listaPuntos.innerHTML = "<p>No hay información disponible</p>";
        this.interfaz.totalElementos.textContent = "Número total: 0";
        this.mapa.limpiarMarcadores();
    }
}
