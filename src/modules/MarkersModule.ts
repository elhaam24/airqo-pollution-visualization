import { AirQoMeasurement } from '../types';

export class MarkersModule {
  private static markers: any[] = [];
  private static infoWindow: google.maps.InfoWindow | null = null;

  static async init(map: google.maps.Map, measurements: AirQoMeasurement[]) {
    if (!this.infoWindow) {
      this.infoWindow = new google.maps.InfoWindow();
    }

    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

    measurements.forEach(m => {
      const pmValue = m.pm2_5.value || 0;
      const siteName = m.siteDetails.description || "Unknown Station";
      const color = this.getAQIColor(pmValue);

      const pin = new PinElement({
        background: color,
        borderColor: '#ffffff',
        glyphColor: '#ffffff',
        scale: 1.2
      });

      const marker = new AdvancedMarkerElement({
        position: {
          lat: m.siteDetails.approximate_latitude,
          lng: m.siteDetails.approximate_longitude
        },
        map: map,
        content: pin.element,
        title: siteName
      });

      marker.addListener("click", () => {
        const category = this.getAQICategory(pmValue);
        const percentage = Math.min((pmValue / 150) * 100, 100);
        
        const content = `
          <div style="padding: 16px; font-family: 'Inter', sans-serif; width: 220px; background: white;">
            <p style="margin: 0; text-transform: uppercase; font-size: 9px; font-weight: 700; color: #70757a; letter-spacing: 0.1em; margin-bottom: 4px;">Station Location</p>
            <h3 style="margin: 0 0 12px 0; color: #1a1c1e; font-size: 15px; font-weight: 700; line-height: 1.2;">${siteName}</h3>
            
            <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 8px;">
              <div style="display: flex; align-items: baseline; gap: 4px;">
                <span style="font-size: 24px; font-weight: 300; color: #1a1c1e;">${pmValue.toFixed(1)}</span>
                <span style="font-size: 10px; color: #5f6368;">µg/m³</span>
              </div>
              <span style="font-size: 10px; font-weight: 700; color: ${color}; text-transform: uppercase; letter-spacing: 0.05em;">${category}</span>
            </div>

            <div style="width: 100%; height: 4px; background: #f1f3f4; border-radius: 10px; overflow: hidden; margin-bottom: 12px;">
              <div style="width: ${percentage}%; height: 100%; background: ${color}; border-radius: 10px;"></div>
            </div>

            <p style="margin: 0; font-size: 9px; color: #bdc1c6; font-weight: 500;">PM2.5 Measurement Point</p>
          </div>
        `;
        this.infoWindow?.setContent(content);
        this.infoWindow?.open(map, marker);
      });

      this.markers.push(marker);
    });
  }

  static getAQIColor(value: number): string {
    if (value <= 12) return '#00e400';
    if (value <= 35) return '#ffff00';
    if (value <= 55) return '#ff7e00';
    if (value <= 150) return '#ff0000';
    return '#8f3f97';
  }

  static getAQICategory(value: number): string {
    if (value <= 12) return 'Good';
    if (value <= 35) return 'Moderate';
    if (value <= 55) return 'Unhealthy for Sensitive Groups';
    if (value <= 150) return 'Unhealthy';
    return 'Hazardous';
  }

  static teardown() {
    this.markers.forEach(m => m.map = null);
    this.markers = [];
    this.infoWindow?.close();
  }
}
