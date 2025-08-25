import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface AddMapMarker{
    addLocation: (id: number,lat: number, long: number) => void
}

export const Map = forwardRef<AddMapMarker,{}>((props, ref) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    mapInstance.current = L.map(mapRef.current).setView([40.7128, -74.0060], 13);
    L.tileLayer('https://api.maptiler.com/maps/openstreetmap/{z}/{x}/{y}.jpg?key=0HQBpLDWwecBoB8DzwKo', {
      attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
    }).addTo(mapInstance.current);
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);
  useImperativeHandle(ref,()=>({
    addLocation: (lat: number, long: number) => {
        if(!mapRef.current || !mapInstance.current) return;
        L.marker([lat, long]).addTo(mapInstance.current);
    }
  }));
  
  return (
    <div ref={mapRef} id="map" 
    style={{ height: "400px", width: "100%", minHeight: "400px", minWidth: "300px", border: "1px solid #ccc" }} 
    />
  );
});

export default Map;