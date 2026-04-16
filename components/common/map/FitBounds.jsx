// FitBounds.jsx
import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";

const FitBounds = ({ route }) => {
  const map = useMap();
  const hasFitted = useRef(false); // ← track if we've already fitted

  useEffect(() => {
    if (route?.length > 0 && !hasFitted.current) {
      map.fitBounds(route);
      hasFitted.current = true; // ← never fit again after first time
    }
  }, [route, map]);

  return null;
};

export default FitBounds;

// FitBounds.jsx — "soft follow" mode
// import { useEffect, useRef } from "react";
// import { useMap } from "react-leaflet";

// const FitBounds = ({ route }) => {
//   const map = useMap();
//   const hasFitted = useRef(false);
//   const prevLastPoint = useRef(null);

//   useEffect(() => {
//     if (!route?.length) return;

//     const lastPoint = route[route.length - 1];

//     // Initial fit — run once
//     if (!hasFitted.current) {
//       map.fitBounds(route);
//       hasFitted.current = true;
//       prevLastPoint.current = lastPoint;
//       return;
//     }

//     // Only pan to new point if it actually changed, preserving user's zoom
//     const isSamePoint =
//       prevLastPoint.current?.[0] === lastPoint[0] &&
//       prevLastPoint.current?.[1] === lastPoint[1];

//     if (!isSamePoint) {
//       map.panTo(lastPoint); // pans smoothly, keeps zoom level intact
//       prevLastPoint.current = lastPoint;
//     }
//   }, [route, map]);

//   return null;
// };

// export default FitBounds;

// import { useEffect } from "react";
// import { useMap } from "react-leaflet";

// const FitBounds = ({ route }) => {
//   const map = useMap();

//   useEffect(() => {
//     if (route.length > 0) {
//       map.fitBounds(route);
//     }
//   }, [route, map]);

//   return null;
// };

// export default FitBounds;
