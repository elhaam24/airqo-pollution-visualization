import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

export class MapManager {
  private static map: google.maps.Map | null = null;

  static async init(containerId: string): Promise<google.maps.Map> {
    if (this.map) return this.map;

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    console.log("Initializing Map with key starting with:", apiKey ? apiKey.substring(0, 10) + "..." : "MISSING");
    
    if (!apiKey) {
      console.error("Google Maps API Key (VITE_GOOGLE_MAPS_API_KEY) is missing! Please set it in your environment/secrets.");
    }

    try {
      setOptions({
        key: apiKey || "AIzaSyDh5Qe52LtKK_wR488E799uySy_jszxzuU", // Fallback to provided key if env var is missing
        v: "weekly",
        libraries: ["places"]
      });

      await Promise.all([
        importLibrary('maps'),
        importLibrary('places'),
        importLibrary('marker')
      ]);
    } catch (err) {
      console.error("Google Maps Initialization Failed:", err);
      throw err;
    }

    const { Map } = await importLibrary('maps') as google.maps.MapsLibrary;
    const container = document.getElementById(containerId);
    
    if (!container) {
      throw new Error(`Map container #${containerId} not found`);
    }

    this.map = new Map(container, {
      center: { lat: 0.3476, lng: 32.5825 }, // Default to Kampala
      zoom: 12,
      mapId: 'DEMO_MAP_ID', // Required for Advanced Markers
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ]
    });

    return this.map;
  }

  static getMap(): google.maps.Map | null {
    return this.map;
  }
}
