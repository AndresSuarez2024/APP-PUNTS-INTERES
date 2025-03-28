class Mapa {
    constructor() {
        this.map = L.map('map').setView([0, 0], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);
        this.markers = new L.LayerGroup().addTo(this.map);
    }

    agregarMarcador(lat, lng, popupContent) {
        L.marker([lat, lng]).addTo(this.markers).bindPopup(popupContent);
    }

    limpiarMarcadores() {
        this.markers.clearLayers();
    }
}
