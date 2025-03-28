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

    // Mètode per mostrar la llista de punts d'interès amb la bandera
    mostrarListaPuntos(puntos) {
        this.listaPuntos.innerHTML = "";
        puntos.forEach((punto, index) => {
            let li = document.createElement("li");

            // Crear la imatge de la bandera utilitzant la funció d'API
            let bandera = document.createElement("img");
            this.obtenerBandera(punto.pais).then(banderaUrl => {
                bandera.src = banderaUrl;
                bandera.alt = `Bandera de ${punto.pais}`;
                bandera.style.width = "30px";
                bandera.style.marginRight = "10px";
            }).catch(() => {
                bandera.src = 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Flag_of_the_United_States.svg';  // Bandera per defecte
            });

            // Crear el text amb la informació del punt
            let textoPunto = document.createElement("span");
            textoPunto.textContent = `${punto.nombre} (${punto.ubicacion}, ${punto.pais}) - Tipo: ${punto.tipo} - Capacidad: ${punto.capacidad}`;
            
            // Afegir la bandera i el text a la llista
            li.appendChild(bandera);
            li.appendChild(textoPunto);

            let btnEliminar = document.createElement("button");
            btnEliminar.textContent = "Eliminar";
            btnEliminar.onclick = () => this.eliminarPunto(index);
            li.appendChild(btnEliminar);

            this.listaPuntos.appendChild(li);
        });

        this.totalElementos.textContent = `Número total: ${puntos.length}`;
    }

    // Mètode per obtenir la URL de la bandera del país
    async obtenerBandera(pais) {
        try {
            let response = await fetch(`https://restcountries.com/v3.1/name/${pais}?fullText=true`);
            if (!response.ok) throw new Error("No es va poder obtenir la informació del país.");
            let data = await response.json();
            return data[0].flags.png; // Retorna l'URL de la bandera
        } catch (error) {
            console.error('Error al obtenir la bandera:', error);
            return 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Flag_of_the_United_States.svg'; // Bandera per defecte
        }
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
