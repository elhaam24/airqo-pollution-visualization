import { MapManager } from './MapManager';
import { StateManager } from './StateManager';
import { AirQoService } from '../services/AirQoService';
import { HeatmapModule } from '../modules/HeatmapModule';
import { MarkersModule } from '../modules/MarkersModule';
import { SearchModule } from '../modules/SearchModule';

export class StageManager {
  private static airQoService = new AirQoService();

  static async init(containerId: string, searchInputId: string) {
    try {
      // 1. Initialize Map
      const map = await MapManager.init(containerId);

      // 2. Initialize Search
      await SearchModule.init(map, searchInputId);

      // 3. Fetch Data
      const measurements = await this.airQoService.fetchRecentData();
      StateManager.set('measurements', measurements);

      // 4. Initial Render (Heatmap)
      HeatmapModule.init(map, measurements);

      // 5. Center map if data exists
      if (measurements.length > 0) {
        const first = measurements[0].siteDetails;
        map.setCenter({
          lat: first.approximate_latitude,
          lng: first.approximate_longitude
        });
      }
    } catch (error) {
      console.error("StageManager init error:", error);
    }
  }

  static async toggleView() {
    const map = MapManager.getMap();
    if (!map) return;

    const data = StateManager.get('measurements');
    const currentView = StateManager.get('viewMode');

    if (currentView === 'heatmap') {
      HeatmapModule.teardown();
      await MarkersModule.init(map, data);
      StateManager.set('viewMode', 'markers');
    } else {
      MarkersModule.teardown();
      HeatmapModule.init(map, data);
      StateManager.set('viewMode', 'heatmap');
    }
  }
}
