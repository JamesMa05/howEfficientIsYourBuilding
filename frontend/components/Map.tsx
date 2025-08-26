import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface AddMapMarker{
    addLocation: (id: string, lat: number, long: number, score: number) => void
    removeLocation: (id:string) => void
}
export interface MarkerClick{ //shapes the structure of the isClicked state + address information
  setIsClicked: (options: {click: boolean, name: string, score: number}) => void
}
export const Map = forwardRef<AddMapMarker,MarkerClick>(({setIsClicked}, ref) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string,L.Marker>>({});

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
    addLocation: (id:string, lat: number, long: number, score: number) => {
        if(markersRef.current[id] || !mapInstance.current) {window.alert("Marker already exists"); return};
        markersRef.current[id] = L.marker([lat, long]).addTo(mapInstance.current);
        
        markersRef.current[id].on('click', () => {
          setIsClicked({click:true, name: id, score:score});
        })
    },
    removeLocation:(id:string) => {
      markersRef.current[id]?.remove();
      delete markersRef.current[id];  
    }
  }));
  return (
    <div ref={mapRef} id="map" 
    style={{ height: "400px", width: "100%", minHeight: "400px", minWidth: "300px", border: "1px solid #ccc" }} 
    />
  );
});

export default Map;