import { HealthcareFacility } from '../types/health';

export class MapManager {
  private static mapInstance: any = null;
  private static markers: Map<string, any> = new Map();
  private static userMarker: any = null;
  private static currentFacilities: HealthcareFacility[] = [];
  private static userCoords = { lat: 18.8527, lng: 73.9189 };

  public static isLeafletAvailable(): boolean {
    return typeof (window as any).L !== 'undefined';
  }

  public static initMap(
    containerId: string,
    facilities: HealthcareFacility[],
    userCoords = { lat: 18.8527, lng: 73.9189 }
  ): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    this.userCoords = userCoords;
    this.currentFacilities = facilities;

    // Wait for Leaflet if CDN is still downloading
    if (!this.isLeafletAvailable()) {
      const checkInterval = setInterval(() => {
        if (this.isLeafletAvailable()) {
          clearInterval(checkInterval);
          this.buildMap(containerId, facilities);
        }
      }, 100);

      setTimeout(() => clearInterval(checkInterval), 5000);
      return;
    }

    this.buildMap(containerId, facilities);
  }

  private static buildMap(containerId: string, facilities: HealthcareFacility[]): void {
    const L = (window as any).L;
    const container = document.getElementById(containerId);
    if (!container || !L) return;

    // Remove placeholder loader
    const loader = document.getElementById('map-loading-placeholder');
    if (loader) loader.style.display = 'none';

    // Cleanup previous map instance if re-initializing
    if (this.mapInstance) {
      try {
        this.mapInstance.remove();
      } catch {
        // ignore
      }
      this.mapInstance = null;
      this.markers.clear();
    }

    // Initialize Map
    this.mapInstance = L.map(containerId, {
      center: [this.userCoords.lat, this.userCoords.lng],
      zoom: 11,
      zoomControl: true
    });

    // High quality OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.mapInstance);

    // Add Patient User GPS Location Pin (Pulsing blue radar)
    const userIcon = L.divIcon({
      className: 'user-gps-container',
      html: '<div class="user-gps-pulse" title="Your GPS Location"></div>',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    this.userMarker = L.marker([this.userCoords.lat, this.userCoords.lng], { icon: userIcon })
      .addTo(this.mapInstance)
      .bindPopup(`
        <div style="padding: 10px; font-size: 0.82rem; text-align: center;">
          <div style="font-weight: 700; color: #1e293b;">📍 Your Location</div>
          <div style="color: #64748b; font-size: 0.74rem;">Pune Rural Hub (Lat: ${this.userCoords.lat}, Lng: ${this.userCoords.lng})</div>
        </div>
      `);

    // Render facility markers
    this.renderMarkers(facilities);

    // Initial fit to bounds
    this.fitAll();
  }

  private static renderMarkers(facilities: HealthcareFacility[]): void {
    const L = (window as any).L;
    if (!this.mapInstance || !L) return;

    this.markers.forEach((marker) => {
      try {
        this.mapInstance.removeLayer(marker);
      } catch {
        // ignore
      }
    });
    this.markers.clear();

    facilities.forEach((facility) => {
      let pinClass = 'pin-phc';
      let iconEmoji = '🩺';

      if (facility.type === 'Community Health Centre (CHC)') {
        pinClass = 'pin-chc';
        iconEmoji = '🏛️';
      } else if (facility.type === 'District Hospital') {
        pinClass = 'pin-district';
        iconEmoji = '🏨';
      } else if (facility.type === '24/7 Pharmacy') {
        pinClass = 'pin-pharmacy';
        iconEmoji = '💊';
      } else if (facility.type === 'Private Clinic') {
        pinClass = 'pin-clinic';
        iconEmoji = '🩹';
      } else if (facility.type === 'Emergency Care') {
        pinClass = 'pin-emergency';
        iconEmoji = '🚨';
      }

      const customIcon = L.divIcon({
        className: 'custom-pin-wrapper',
        html: `<div class="custom-map-pin ${pinClass}" id="marker-${facility.id}" title="${facility.name}">${iconEmoji}</div>`,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
        popupAnchor: [0, -20]
      });

      const driveTime = facility.estimatedDriveTimeMin ? `(~${facility.estimatedDriveTimeMin} mins)` : '';

      const popupContent = `
        <div style="padding: 12px; min-width: 230px; font-family: system-ui, -apple-system, sans-serif;">
          <div style="font-size: 0.95rem; font-weight: 700; color: #0f172a; margin-bottom: 2px;">
            ${facility.name}
          </div>
          <div style="font-size: 0.76rem; font-weight: 600; color: #059669; margin-bottom: 6px;">
            ${facility.type} • ${facility.isOpen24x7 ? '🟢 24/7 OPEN' : '🕒 8 AM – 8 PM'}
          </div>
          <div style="font-size: 0.78rem; color: #475569; margin-bottom: 8px;">
            📍 ${facility.address}
          </div>
          <div style="font-size: 0.78rem; font-weight: 700; color: #1e293b; margin-bottom: 10px;">
            🚗 ${facility.distanceKm} km away ${driveTime}
          </div>
          <div style="display: flex; gap: 6px;">
            <a 
              href="tel:${facility.phone.replace(/[^0-9+]/g, '')}" 
              class="btn btn--primary btn--sm" 
              style="flex: 1; text-align: center; justify-content: center; font-size: 0.75rem; padding: 6px;"
            >
              📞 Call
            </a>
            <a 
              href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(facility.name + ', ' + facility.address)}" 
              target="_blank" 
              rel="noopener noreferrer"
              class="btn btn--secondary btn--sm" 
              style="flex: 1; text-align: center; justify-content: center; font-size: 0.75rem; padding: 6px;"
            >
              🧭 Route
            </a>
          </div>
        </div>
      `;

      const marker = L.marker([facility.lat, facility.lng], { icon: customIcon })
        .addTo(this.mapInstance)
        .bindPopup(popupContent);

      this.markers.set(facility.id, marker);
    });
  }

  public static updateVisibleFacilities(facilities: HealthcareFacility[]): void {
    this.currentFacilities = facilities;
    if (!this.mapInstance) return;

    this.renderMarkers(facilities);
    this.fitAll();
  }

  public static focusFacility(facilityId: string): void {
    if (!this.mapInstance) return;

    const facility = this.currentFacilities.find((f) => f.id === facilityId);
    const marker = this.markers.get(facilityId);

    if (facility && marker) {
      this.mapInstance.flyTo([facility.lat, facility.lng], 14, {
        duration: 1.2
      });
      setTimeout(() => {
        marker.openPopup();
      }, 800);
    }
  }

  public static fitAll(): void {
    const L = (window as any).L;
    if (!this.mapInstance || !L) return;

    const groupPoints: [number, number][] = [[this.userCoords.lat, this.userCoords.lng]];

    this.markers.forEach((marker) => {
      const latlng = marker.getLatLng();
      groupPoints.push([latlng.lat, latlng.lng]);
    });

    if (groupPoints.length > 1) {
      const bounds = L.latLngBounds(groupPoints);
      this.mapInstance.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }

  public static centerUser(): void {
    if (!this.mapInstance) return;
    this.mapInstance.flyTo([this.userCoords.lat, this.userCoords.lng], 13, { duration: 1 });
    if (this.userMarker) {
      this.userMarker.openPopup();
    }
  }

  public static invalidateSize(): void {
    if (this.mapInstance) {
      setTimeout(() => {
        this.mapInstance.invalidateSize();
      }, 100);
    }
  }
}
