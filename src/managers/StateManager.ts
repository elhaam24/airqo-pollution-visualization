import { AirQoMeasurement, ViewMode } from '../types';

export class StateManager {
  private static state: {
    measurements: AirQoMeasurement[];
    viewMode: ViewMode;
  } = {
    measurements: [],
    viewMode: 'heatmap'
  };

  private static listeners: Set<() => void> = new Set();

  static set<K extends keyof typeof StateManager.state>(key: K, value: typeof StateManager.state[K]) {
    this.state[key] = value;
    this.notify();
  }

  static get<K extends keyof typeof StateManager.state>(key: K): typeof StateManager.state[K] {
    return this.state[key];
  }

  static subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private static notify() {
    this.listeners.forEach(l => l());
  }
}
