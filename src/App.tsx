/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useRef } from 'react';
import { StageManager } from './managers/StageManager';
import { StateManager } from './managers/StateManager';
import { MapManager } from './managers/MapManager';
import { GeolocationModule } from './modules/GeolocationModule';
import { Search, Map as MapIcon, Layers, Navigation, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [viewMode, setViewMode] = useState<'heatmap' | 'markers'>('heatmap');
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('Initializing Map...');
  const legendRef = useRef<HTMLDivElement>(null);

  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    async function start() {
      setLoadingMsg('Fetching Air Quality Data...');
      await StageManager.init('map-canvas', 'pac-input');
      
      const map = MapManager.getMap();
      if (map && legendRef.current) {
        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legendRef.current);
      }

      setIsLoaded(true);
    }

    start();

    const unsubscribe = StateManager.subscribe(() => {
      setViewMode(StateManager.get('viewMode'));
    });

    return () => unsubscribe();
  }, []);

  const handleToggle = () => {
    StageManager.toggleView();
  };

  const handleLocate = async () => {
    const map = MapManager.getMap();
    if (map) {
      setIsLocating(true);
      try {
        await GeolocationModule.findUser(map);
      } finally {
        setIsLocating(false);
      }
    }
  };

  return (
    <div className="flex w-full h-screen font-sans bg-[#f8f9fa] text-[#1a1c1e] overflow-hidden">
      {/* Sidebar Controls */}
      <aside className="w-80 h-full bg-white border-r border-[#e1e3e8] p-8 flex flex-col shrink-0 z-10 shadow-sm overflow-y-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-[#4285f4] rounded-lg flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M2 12h20"/>
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#1a1c1e]">AirQo <span className="font-normal text-[#5f6368]">Vision</span></h1>
          </div>
          <p className="text-[10px] text-[#70757a] uppercase tracking-widest font-bold">Pollution Analytics Platform</p>
        </div>

        <div className="flex-1 space-y-8">
          {/* Location Search */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-[#5f6368] uppercase ml-1 tracking-wider">Location Search</label>
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5f6368]" />
              <input 
                id="pac-input"
                type="text" 
                placeholder="Search Kampala, Uganda..." 
                className="w-full pl-11 pr-4 py-3.5 bg-[#f1f3f4] border-transparent rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-[#4285f4] transition-all placeholder:text-[#9aa0a6]"
              />
            </div>
            <button 
              onClick={handleLocate}
              disabled={isLocating}
              className={`w-full flex items-center justify-center gap-2.5 py-3.5 bg-[#e8f0fe] text-[#1967d2] rounded-2xl text-sm font-semibold hover:bg-[#d2e3fc] transition-all active:scale-[0.98] ${isLocating ? 'opacity-70' : ''}`}
            >
              <Navigation className={`w-4 h-4 ${isLocating ? 'animate-pulse' : ''}`} />
              {isLocating ? 'Locating...' : 'Find My Location'}
            </button>
          </div>

          {/* Visualization Mode */}
          <div className="space-y-3 pt-6 border-t border-[#f1f3f4]">
            <label className="text-[11px] font-bold text-[#5f6368] uppercase ml-1 tracking-wider">Visualization Mode</label>
            <div className="flex p-1.5 bg-[#f1f3f4] rounded-2xl">
              <button 
                onClick={() => viewMode !== 'heatmap' && handleToggle()}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  viewMode === 'heatmap' 
                  ? 'bg-white text-[#1a1c1e] shadow-sm' 
                  : 'text-[#5f6368] hover:text-[#1a1c1e]'
                }`}
              >
                Heatmap
              </button>
              <button 
                onClick={() => viewMode !== 'markers' && handleToggle()}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  viewMode === 'markers' 
                  ? 'bg-white text-[#1a1c1e] shadow-sm' 
                  : 'text-[#5f6368] hover:text-[#1a1c1e]'
                }`}
              >
                Markers
              </button>
            </div>
          </div>

          {/* Map Info Card */}
          <div className="pt-2">
            <div className="bg-[#f8f9fa] p-5 rounded-3xl border border-[#e1e3e8]">
              <p className="text-[10px] font-bold text-[#70757a] uppercase mb-2 tracking-widest">Active View</p>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${viewMode === 'heatmap' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1a1c1e] capitalize">{viewMode} Mode</p>
                  <p className="text-[10px] text-[#5f6368] font-medium leading-tight mt-0.5">Showing real-time PM2.5 data for the current region.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-6 border-t border-[#f1f3f4] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#34a853] animate-pulse" />
            <span className="text-[10px] font-medium text-[#70757a] uppercase tracking-widest">Live Sync</span>
          </div>
          <p className="text-[10px] text-[#bdc1c6] font-medium tracking-tight">V1.2.4</p>
        </div>
      </aside>

      {/* Main Map Area */}
      <main className="flex-1 relative bg-[#e5e5f7]">
        {/* Map Container */}
        <div id="map-canvas" className="w-full h-full" />

        {/* Loading Overlay */}
        <AnimatePresence>
          {!isLoaded && (
            <motion.div 
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white"
            >
              <Loader2 className="w-12 h-12 mb-4 text-[#4285f4] animate-spin" />
              <p className="text-[#5f6368] font-semibold tracking-tight">{loadingMsg}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legend (Attached to Google Maps Control via Ref) */}
        <div ref={legendRef} className="aqi-legend hidden lg:block">
          <h4>Air Quality Index (PM2.5)</h4>
          <div className="space-y-1">
            <div className="legend-item">
              <div className="color-box bg-[#00e400]" />
              <div className="legend-label">Good</div>
              <div className="legend-value">0 - 12</div>
            </div>
            <div className="legend-item">
              <div className="color-box bg-[#ffff00]" />
              <div className="legend-label">Moderate</div>
              <div className="legend-value">13 - 35</div>
            </div>
            <div className="legend-item">
              <div className="color-box bg-[#ff7e00]" />
              <div className="legend-label">Sensitive</div>
              <div className="legend-value">36 - 55</div>
            </div>
            <div className="legend-item">
              <div className="color-box bg-[#ff0000]" />
              <div className="legend-label">Unhealthy</div>
              <div className="legend-value">56 - 150</div>
            </div>
            <div className="legend-item">
              <div className="color-box bg-[#8f3f97]" />
              <div className="legend-label">Hazardous</div>
              <div className="legend-value">150+</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
