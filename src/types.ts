export interface AirQoMeasurement {
  siteDetails: {
    approximate_latitude: number;
    approximate_longitude: number;
    description: string;
  };
  pm2_5: {
    value: number;
  };
  aqi_category?: string;
}

export type ViewMode = 'heatmap' | 'markers';
