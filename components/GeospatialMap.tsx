
import React, { useEffect, useRef, useState } from 'react';
import { EnhancedFrameworkData } from '../services/mockData';
import { HazardLevel } from '../types';

// Access global L and turf from script tags safely
const getL = () => (window as any).L;
const getTurf = () => (window as any).turf;

interface Props {
  data: EnhancedFrameworkData;
}

export const GeospatialMap: React.FC<Props> = ({ data }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layerControlRef = useRef<any>(null);
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [selectedCoords, setSelectedCoords] = useState<string | null>(null);

  // Client-side Energy Suitability Formula
  const calculateEnergyScore = (lat: number, lng: number) => {
    const turf = getTurf();
    if (!turf || !data) return 0;
    
    try {
        const point = turf.point([lng, lat]);
        
        // 1. Distance to Power (Substations/Plants)
        const powerFeatures = data.powerStations.map(p => turf.point([p.lng, p.lat]));
        let distPower = 500; 
        if (powerFeatures.length > 0) {
            const powerCollection = turf.featureCollection(powerFeatures);
            const nearestPower = turf.nearestPoint(point, powerCollection);
            distPower = turf.distance(point, nearestPower); // km
        }

        // 2. Distance to Gas (Pipelines)
        // Turf needs [lng, lat]. Pipeline path is [lat, lng].
        // We extract all points from paths.
        const pipelinePoints: any[] = [];
        data.pipelines.forEach(p => {
            p.path.forEach(coord => {
                pipelinePoints.push(turf.point([coord[1], coord[0]]));
            });
        });

        let distGas = 500;
        if (pipelinePoints.length > 0) {
            const pipelineCollection = turf.featureCollection(pipelinePoints);
            const nearestGas = turf.nearestPoint(point, pipelineCollection);
            distGas = turf.distance(point, nearestGas);
        }

        // 3. Distance to Data Centers (Competition - Negative)
        const dcFeatures = data.geoLocations
            .filter(g => g.type === 'data_center')
            .map(d => turf.point([d.lng, d.lat]));
        let distDC = 1000;
        if (dcFeatures.length > 0) {
            const dcCollection = turf.featureCollection(dcFeatures);
            const nearestDC = turf.nearestPoint(point, dcCollection);
            distDC = turf.distance(point, nearestDC);
        }

        // Formula
        const powerScore = Math.max(0, 35 * (1 - distPower / 200)); 
        const gasScore = Math.max(0, 25 * (1 - distGas / 300));
        const dcPenalty = distDC < 100 ? -20 * (1 - distDC / 100) : 0;
        const regulatoryScore = 15; 
        
        return Math.min(100, Math.max(0, powerScore + gasScore + dcPenalty + regulatoryScore));
    } catch (e) {
        console.error("Turf calculation error", e);
        return 0;
    }
  };

  // One-time Map Initialization
  useEffect(() => {
    const L = getL();
    if (!mapContainerRef.current || !L) return;

    // Strict cleanup: if map exists, destroy it before re-creating
    if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
        fadeAnimation: false // Reduce glitching
    }).setView([31.5, -100.0], 6);

    // Add controls manually for better positioning
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Dark Basemap
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19,
        className: 'map-tiles'
    }).addTo(map);

    mapInstanceRef.current = map;

    // Resize observer to prevent gray areas/glitches
    const resizeObserver = new ResizeObserver(() => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
        }
    });
    resizeObserver.observe(mapContainerRef.current);

    // Click Interaction
    map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        const score = calculateEnergyScore(lat, lng);
        setSelectedScore(Math.round(score));
        setSelectedCoords(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        
        L.popup({
            closeButton: false,
            className: 'custom-popup',
            autoPan: false
        })
         .setLatLng(e.latlng)
         .setContent(`
            <div style="font-family: 'JetBrains Mono', monospace; padding: 8px; background: #18181b; color: #f4f4f5; border: 1px solid #27272a; border-radius: 4px;">
               <div style="color: #f97316; font-weight: bold; margin-bottom: 4px; font-size: 12px;">SUITABILITY: ${Math.round(score)}/100</div>
               <div style="color: #a1a1aa; font-size: 10px;">Lat: ${lat.toFixed(2)} | Lng: ${lng.toFixed(2)}</div>
            </div>
         `)
         .openOn(map);
    });

    return () => {
        resizeObserver.disconnect();
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }
    };
  }, []);

  // Data Rendering (runs when data changes or map is ready)
  useEffect(() => {
    const L = getL();
    const map = mapInstanceRef.current;
    if (!map || !data || !L) return;

    // Remove old layer control if exists
    if (layerControlRef.current) {
        layerControlRef.current.remove();
    }

    // Create Layer Groups
    const layers = {
        pipelines: L.layerGroup().addTo(map),
        zones: L.layerGroup().addTo(map),
        infrastructure: L.layerGroup().addTo(map)
    };

    // 1. Pipelines
    data.pipelines.forEach(pipe => {
        if (pipe.path && pipe.path.length > 0) {
            L.polyline(pipe.path, {
                color: '#d946ef', // Bright Fuchsia
                weight: 3,
                opacity: 0.9,
                lineCap: 'round'
            }).bindTooltip(pipe.name, { sticky: true, className: 'bg-black text-white border-0' }).addTo(layers.pipelines);
        }
    });

    // 2. ISO Zones
    data.isoZones.forEach(zone => {
        if (zone.coordinates && zone.coordinates.length > 0) {
            L.polygon(zone.coordinates, {
                color: '#10b981', // Emerald
                weight: 1,
                fillColor: '#10b981',
                fillOpacity: 0.15,
                dashArray: '5, 5'
            }).addTo(layers.zones);
        }
    });

    // 3. Infrastructure (Power + Crypto)
    // Power Stations
    data.powerStations.forEach(st => {
        L.circleMarker([st.lat, st.lng], {
            radius: 6,
            color: '#10b981',
            fillColor: '#000',
            fillOpacity: 1,
            weight: 2
        }).bindTooltip(`${st.name} (${st.capacity}MW)`).addTo(layers.infrastructure);
    });

    // Geo Locations
    data.geoLocations.forEach(loc => {
        let color = '#fbbf24'; // Amber
        if (loc.hazard === HazardLevel.Critical || loc.type === 'data_center') color = '#ef4444';
        if (loc.type === 'mining_cluster') color = '#f97316';

        L.circleMarker([loc.lat, loc.lng], {
            radius: 6,
            fillColor: color,
            fillOpacity: 0.8,
            color: '#fff',
            weight: 1
        }).bindPopup(`
            <div style="font-family: 'JetBrains Mono', monospace; color: #18181b;">
                <div style="font-weight: bold; font-size: 12px;">${loc.name}</div>
                <div style="font-size: 10px; opacity: 0.8;">${loc.type.replace('_', ' ')}</div>
                <div style="font-size: 10px; margin-top:4px;">${loc.description}</div>
            </div>
        `).addTo(layers.infrastructure);
    });

    // Add Layer Control to Map
    const overlays = {
        "<span style='color:#d946ef'>■</span> Pipelines": layers.pipelines,
        "<span style='color:#10b981'>■</span> ISO Zones": layers.zones,
        "<span style='color:#f97316'>●</span> Infrastructure": layers.infrastructure
    };
    
    layerControlRef.current = L.control.layers(null, overlays, { 
        position: 'topright',
        collapsed: false 
    }).addTo(map);

  }, [data]); // Only re-run if data changes

  return (
    <div className="w-full bg-inst-surface rounded-md border border-inst-border relative overflow-hidden flex flex-col h-[500px] flex-shrink-0 shadow-xl">
       {/* Status Overlay */}
       <div className="absolute top-4 left-4 z-[400] pointer-events-none">
           <div className="bg-black/80 backdrop-blur border border-inst-border px-3 py-1.5 rounded flex items-center gap-2 shadow-lg">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               <span className="text-[10px] font-mono text-emerald-100 uppercase tracking-wider">GIS Live</span>
           </div>
           {/* Framework Context Overlay */}
           <div className="mt-2 bg-black/80 backdrop-blur border border-inst-accent/30 px-3 py-2 rounded shadow-lg max-w-[200px]">
               <span className="block text-[9px] text-inst-muted uppercase tracking-widest mb-1">3B³ Framework Context</span>
               <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#f97316] rounded-full"></span>
                    <span className="text-[10px] text-white font-mono">GEOSPHERE (Mining)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#d946ef] rounded-full"></span>
                    <span className="text-[10px] text-white font-mono">BIOSPHERE (Energy)</span>
                  </div>
               </div>
           </div>
       </div>
       
       {selectedScore !== null && (
           <div className="absolute bottom-16 right-4 z-[400] animate-in slide-in-from-bottom-4">
               <div className="bg-inst-surface/95 backdrop-blur border border-inst-accent p-4 rounded shadow-2xl min-w-[200px]">
                   <span className="block text-[10px] text-inst-muted uppercase tracking-widest mb-1">Energy Suitability</span>
                   <div className="flex items-baseline gap-2">
                       <span className="text-3xl font-bold font-mono text-inst-accent">{selectedScore}</span>
                       <span className="text-sm text-inst-muted">/100</span>
                   </div>
                   <div className="h-1 w-full bg-inst-bg mt-2 rounded-full overflow-hidden">
                        <div className="h-full bg-inst-accent transition-all duration-500" style={{ width: `${selectedScore}%` }}></div>
                   </div>
                   <span className="block text-[9px] text-inst-muted mt-2 font-mono">{selectedCoords}</span>
               </div>
           </div>
       )}

       <div ref={mapContainerRef} className="flex-grow bg-[#09090b] z-0" style={{ isolation: 'isolate' }} />
       
       <div className="h-8 bg-inst-surface border-t border-inst-border flex items-center px-4 gap-4 text-[9px] font-mono text-inst-muted overflow-x-auto whitespace-nowrap z-10 flex-shrink-0">
          <span className="text-inst-accent">INTERACTION:</span>
          <span>CLICK MAP FOR PARCEL SCORING</span>
          <span className="w-px h-3 bg-inst-border mx-1"></span>
          <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-[#d946ef]"></span>Gas Lines</span>
          <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></div>Power</span>
          <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#f97316]"></div>Mines</span>
          <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#ef4444]"></div>Data Ctrs</span>
       </div>
    </div>
  );
};