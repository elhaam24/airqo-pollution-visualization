import { AirQoMeasurement } from '../types';

export class AirQoService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'https://api.airqo.net/api/v2/devices/measurements';
  }

  async fetchRecentData(_tenant: string = 'airqo'): Promise<AirQoMeasurement[]> {
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Generating mock measurements around Kampala, Uganda
    const centerLat = 0.3476;
    const centerLng = 32.5825;
    
    const locations = [
      { name: "Makerere University", lat: centerLat + 0.01, lng: centerLng + 0.01, pm: 12.4 },
      { name: "Kiswa Primary School", lat: centerLat - 0.01, lng: centerLng + 0.03, pm: 34.2 },
      { name: "Kireka Market", lat: centerLat + 0.02, lng: centerLng + 0.05, pm: 68.1 },
      { name: "Rubaga Hospital", lat: centerLat - 0.02, lng: centerLng - 0.02, pm: 15.5 },
      { name: "Nakasero Hospital", lat: centerLat + 0.005, lng: centerLng + 0.005, pm: 10.2 },
      { name: "Bwaise Bus Park", lat: centerLat + 0.04, lng: centerLng - 0.01, pm: 155.8 }, // Hazardous
      { name: "Ntinda View", lat: centerLat + 0.015, lng: centerLng + 0.045, pm: 42.6 },
      { name: "Gaba Road", lat: centerLat - 0.05, lng: centerLng + 0.04, pm: 25.3 },
      { name: "Entebbe Road", lat: centerLat - 0.08, lng: centerLng + 0.02, pm: 55.7 }
    ];

    return locations.map(loc => ({
      siteDetails: {
        approximate_latitude: loc.lat,
        approximate_longitude: loc.lng,
        description: loc.name
      },
      pm2_5: {
        value: loc.pm
      }
    }));
  }
}
