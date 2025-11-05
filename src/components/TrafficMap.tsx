import { useEffect, useRef, useState } from "react";
import { MapPin, Layers, Clock, Maximize2 } from "lucide-react";
import { TrafficData } from "@/hooks/useTrafficData";

interface TrafficMapProps {
  trafficData: TrafficData;
}

const TrafficMap = ({ trafficData }: TrafficMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [showTrafficLayer, setShowTrafficLayer] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (mapContainer.current && !mapRef.current) {
      const script = document.createElement("script");
      script.src = "https://maps.api.2gis.ru/2.0/loader.js?pkg=full";
      script.onload = () => {
        // @ts-ignore
        DG.then(() => {
          // @ts-ignore
          mapRef.current = DG.map(mapContainer.current, {
            center: [51.1694, 71.4491], // Центр Астаны
            zoom: 12,
            key: "9e53b9c0-59b4-4e1e-9248-e3c5dec27407", // <- вставь свой API Key
          });

          // Создаем трафик слой (пример через другой TileLayer)
          // @ts-ignore
          mapRef.current.trafficLayer = DG.tileLayer(
            "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
            { attribution: "Traffic Layer" }
          );

          if (showTrafficLayer) {
            mapRef.current.trafficLayer.addTo(mapRef.current);
          }
        });
      };
      document.body.appendChild(script);
    }
  }, []);

  // Update markers when traffic data changes
  useEffect(() => {
    if (!mapRef.current || !trafficData) return;

    // @ts-ignore
    if (typeof DG === 'undefined') return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add suburb markers
    trafficData.suburbs.forEach((suburb) => {
      if (suburb.id === 'kosshy' || suburb.id === 'shortandy' || suburb.id === 'tselinograd') {
        // @ts-ignore
        const marker = DG.marker([suburb.coordinates?.[0] || 51.17, suburb.coordinates?.[1] || 71.45])
          .addTo(mapRef.current)
          .bindPopup(`
            <div>
              <strong>${suburb.name}</strong><br/>
              Current Flow: ${suburb.current_flow}/h<br/>
              Status: ${suburb.status}
            </div>
          `);
        markersRef.current.push(marker);
      }
    });

    // Add bridge markers
    trafficData.bridges.forEach((bridge) => {
      const coords = bridge.coordinates?.[0] || [51.169, 71.449];
      const color = bridge.traffic.color === 'green' ? 'success' :
                    bridge.traffic.color === 'yellow' ? 'warning' :
                    bridge.traffic.color === 'orange' ? 'warning' : 'destructive';

      // @ts-ignore
      const marker = DG.marker(coords)
        .addTo(mapRef.current)
        .bindPopup(`
          <div>
            <strong>🌉 ${bridge.name}</strong><br/>
            Load: ${bridge.traffic.load_percent.toFixed(1)}%<br/>
            Status: ${bridge.traffic.status}
          </div>
        `);
      markersRef.current.push(marker);
    });
  }, [trafficData]);

  // Таймер для Clock кнопки
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleTrafficLayer = () => {
    if (mapRef.current && mapRef.current.trafficLayer) {
      if (showTrafficLayer) {
        mapRef.current.removeLayer(mapRef.current.trafficLayer);
      } else {
        mapRef.current.trafficLayer.addTo(mapRef.current);
      }
      setShowTrafficLayer(!showTrafficLayer);
    }
  };

  const maximizeMap = () => {
    if (mapContainer.current) {
      const elem = mapContainer.current;
      if (!document.fullscreenElement) {
        elem.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
      if (mapRef.current && mapRef.current.invalidateSize) {
        mapRef.current.invalidateSize();
      }
    }
  };

  const showClock = () => {
    alert("Current time: " + currentTime.toLocaleTimeString());
  };

  return (
    <div className="relative h-full w-full rounded-xl overflow-hidden glass-card">
      {/* 2GIS Map */}
      <div ref={mapContainer} className="absolute inset-0 z-0" />

      {/* Map Controls - Top Right */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <button
          onClick={toggleTrafficLayer}
          className="p-3 glass-card rounded-lg hover:bg-primary/10 transition-colors group"
        >
          <Layers className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
        </button>

        <button
          onClick={showClock}
          className="p-3 glass-card rounded-lg hover:bg-primary/10 transition-colors group"
        >
          <Clock className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
        </button>

        <button
          onClick={maximizeMap}
          className="p-3 glass-card rounded-lg hover:bg-primary/10 transition-colors group"
        >
          <Maximize2 className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
        </button>
      </div>


    </div>
  );
};

export default TrafficMap;
