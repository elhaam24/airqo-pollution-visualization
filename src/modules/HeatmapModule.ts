import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import { AirQoMeasurement } from '../types';

export class HeatmapModule {
  private static overlay: GoogleMapsOverlay | null = null;

  static init(map: google.maps.Map, measurements: AirQoMeasurement[]) {
    const heatmapData = this.transformData(measurements);

    const layer = new HeatmapLayer({
      id: 'heatmap-layer',
      data: heatmapData,
      getPosition: (d: any) => d.location,
      getWeight: (d: any) => d.weight,
      radiusPixels: 40,
      intensity: 1,
      threshold: 0.05,
      colorRange: [
        [0, 228, 0],     // Green
        [255, 255, 0],   // Yellow
        [255, 126, 0],   // Orange
        [255, 0, 0],     // Red
        [143, 63, 151]   // Purple
      ]
    });

    if (this.overlay) {
      this.overlay.setMap(null);
    }

    this.overlay = new GoogleMapsOverlay({
      layers: [layer]
    });

    this.overlay.setMap(map);
  }

  static transformData(measurements: AirQoMeasurement[]) {
    return measurements.map(m => ({
      location: [m.siteDetails.approximate_longitude, m.siteDetails.approximate_latitude],
      weight: m.pm2_5.value || 0.1
    }));
  }

  static teardown() {
    if (this.overlay) {
      this.overlay.setMap(null);
      this.overlay = null;
    }
  }
}
