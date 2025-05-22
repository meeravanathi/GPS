import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  center: [number, number];
  pins?: { id: number; position: [number, number]; title: string }[];
  zoom: number;
  draggable?: boolean;
  showMarker?: boolean;
  showDraggablePin?: boolean;
  markerPosition?: [number, number];
  instructionText?: string;
  height?: string;
  onPositionChange?: (position: [number, number]) => void;
  onMapDoubleClick?: (position: [number, number]) => void; 
}

const Map: React.FC<MapProps> = ({
  center,
  zoom,
  draggable = false,
  showMarker = false,
  showDraggablePin = false,
  markerPosition,
  instructionText,
  height = '100%',
  onPositionChange,
  onMapDoubleClick
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    import('leaflet').then((L) => {
      // If map already initialized, just update view and marker position
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView(center, zoom);

        if (markerRef.current) {
          const pos = markerPosition || center;
          markerRef.current.setLatLng(pos);
          // Update draggable property dynamically
          markerRef.current.dragging[showDraggablePin ? 'enable' : 'disable']();
        }
        return;
      }

      // Initialize map once
      const map = L.map(mapRef.current).setView(center, zoom);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const actualMarkerPos = showMarker
        ? markerPosition || center
        : center;

      if (showMarker || showDraggablePin) {
        const markerIcon = showDraggablePin
          ? L.divIcon({
              html: `<div style="background-color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border: 2px solid #e54e4e;">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#e54e4e">
                        <path d="M12 0c-4.4 0-8 3.6-8 8 0 5.4 7 14.6 7.3 15 0.2 0.2 0.5 0.3 0.7 0.3s0.5-0.1 0.7-0.3c0.3-0.4 7.3-9.6 7.3-15 0-4.4-3.6-8-8-8zM12 12c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"></path>
                      </svg>
                    </div>`,
              className: '',
              iconSize: [30, 30],
              iconAnchor: [15, 30],
            })
          : L.icon({
              iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
              shadowSize: [41, 41],
            });

        const marker = L.marker(actualMarkerPos, {
          icon: markerIcon,
          draggable: showDraggablePin,
        }).addTo(map);

        markerRef.current = marker;

        if (showDraggablePin && onPositionChange) {
          marker.on('drag', () => {
            const pos = marker.getLatLng();
            onPositionChange([pos.lat, pos.lng]);
          });
          marker.on('dragend', () => {
            const pos = marker.getLatLng();
            onPositionChange([pos.lat, pos.lng]);
          });
        }
      }

      if (draggable && (onPositionChange || onMapDoubleClick)) {
        map.doubleClickZoom.disable();

        map.on('dblclick', (e) => {
          const { lat, lng } = e.latlng;

          if (onMapDoubleClick) {
            onMapDoubleClick([lat, lng]);
          }

          if (onPositionChange) {
            onPositionChange([lat, lng]);
          }

          if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
          } else {
            const defaultIcon = L.icon({
              iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
              shadowSize: [41, 41],
            });

            const newMarker = L.marker([lat, lng], { icon: defaultIcon }).addTo(map);
            markerRef.current = newMarker;
          }
        });
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, []); // Run only once to initialize the map

  // Update marker position and draggable status when relevant props change
  useEffect(() => {
    if (markerRef.current) {
      const pos = markerPosition || center;
      markerRef.current.setLatLng(pos);

      if (showDraggablePin) {
        markerRef.current.dragging.enable();
      } else {
        markerRef.current.dragging.disable();
      }
    }
  }, [markerPosition, center, showDraggablePin]);

  // Update map view when center or zoom changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  return (
    <div className="relative w-full" style={{ height }}>
      <div ref={mapRef} className="w-full h-full"></div>

      {instructionText && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="bg-white bg-opacity-70 px-2 py-1 rounded text-red-600 font-bold">
            {instructionText}
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
