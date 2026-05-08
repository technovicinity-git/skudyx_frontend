"use client";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-polylinedecorator";

const PolylineWithArrows = ({ route }) => {
  const map = useMap();

  useEffect(() => {
    if (!route?.length) return;

    const polyline = L.polyline(route, {
      color: "#3b82f6",
      weight: 2,
    }).addTo(map);

    // Add arrows
    const decorator = L?.polylineDecorator(polyline, {
      patterns: [
        {
          offset: 25,
          repeat: 50,
          symbol: L?.Symbol?.arrowHead({
            pixelSize: 5,
            polygon: true,
            pathOptions: {
              color: "#3b82f6",
              fillOpacity: 1,
              weight: 2,
            },
          }),
        },
      ],
    }).addTo(map);

    return () => {
      map.removeLayer(polyline);
      map.removeLayer(decorator);
    };
  }, [route, map]);

  return null;
};

export default PolylineWithArrows;
