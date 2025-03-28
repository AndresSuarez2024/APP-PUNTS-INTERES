// js/Mapa.js
export class Mapa {
    constructor() {
        this.mapa = L.map('map').setView([0, 0], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.mapa);
        this.markers = [];
    }

    agregarMarcador(lat, lng, popupContent) {
        const marker = L.marker([lat, lng]).addTo(this.mapa).bindPopup(popupContent);
        this.markers.push(marker);
    }

    eliminarMarcador(index) {
        if (this.markers[index]) {
            this.mapa.removeLayer(this.markers[index]);
            this.markers.splice(index, 1);
        }
    }

    limpiarMarcadores() {
        this.markers.forEach(marker => {
            this.mapa.removeLayer(marker);
        });
        this.markers = [];
    }
}
