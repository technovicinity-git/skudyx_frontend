"use client";
import React, { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
import FitBounds from "./FitBounds";
import L from "leaflet";
import markerIcon2x from "../../../public/assets/images/marker-icon-2x.png";
import markerIcon from "../../../public/assets/images/marker-icon.png";
import markerShadow from "../../../public/assets/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

const startIcon = new L.Icon({
  iconUrl: "/assets/images/blue-mark.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const endIcon = new L.Icon({
  iconUrl: "/assets/images/green-mark.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

// Component to render dots for each coordinate
const RouteDots = ({ route }) => {
  if (!route?.length) return null;

  return (
    <>
      {route.map((position, index) => (
        <Marker
          key={`dot-${index}`}
          position={position}
          icon={L.divIcon({
            className: "route-dot",
            html: `<div style="
              width: 8px;
              height: 8px;
              background-color: #3b82f6;
              border-radius: 50%;
              border: 1px solid white;
              box-shadow: 0 1px 3px rgba(0,0,0,0.3);
            "></div>`,
            iconSize: [8, 8],
            iconAnchor: [4, 4],
          })}
        />
      ))}
    </>
  );
};

const MapContent = ({ route }) => {
  const [blink, setBlink] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!route?.length) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setBlink(true);

    // stop after 2 blinks (~1s)
    const timer = setTimeout(() => setBlink(false), 1000);

    return () => clearTimeout(timer);
  }, [route]);
  return (
    <MapContainer
      center={route[0]}
      zoom={16}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Polyline positions={route} />
      <RouteDots route={route} />
      <FitBounds route={route} />
      <Marker
        position={route[route.length - 1]}
        icon={L.divIcon({
          className: "end-marker-wrapper",
          html: `<div class="end-marker ${blink ? "blink" : ""}"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        })}
      >
        <Popup>End Location</Popup>
      </Marker>
      <Marker position={route[route.length - 1]} icon={endIcon}>
        <Popup>End Location</Popup>
      </Marker>
      <Marker position={route[0]} icon={startIcon}>
        <Popup>Start Location</Popup>
      </Marker>
    </MapContainer>
  );
};

const MapWithPath = ({ route }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!route?.length) return null;

  return (
    <>
      {/* Normal map view */}
      <div className="relative h-full w-full">
        <MapContent route={route} />

        {/* Fullscreen button */}
        <button
          onClick={() => setIsFullscreen(true)}
          title="Full view"
          className="absolute bottom-3 right-3 z-[1000] flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          {/* Expand icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5-5-5m5 5v-4m0 4h-4"
            />
          </svg>
          Full view
        </button>
      </div>

      {/* Fullscreen modal */}
      {isFullscreen && (
        <div className="fixed inset-0 top-15 z-[99999] bg-black/80 flex items-center justify-center p-2 sm:p-4">
          <div className="relative w-full h-full max-w-full max-h-full rounded-lg sm:rounded-2xl overflow-hidden shadow-2xl lg:ml-[280px] lg:w-[calc(100%-280px)]">
            {/* Close button */}
            <button
              onClick={() => setIsFullscreen(false)}
              title="Close full view"
              className="absolute top-2 right-2 sm:top-3 sm:right-3 z-[10000] flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white shadow-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-5 sm:w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <MapContent route={route} />
          </div>
        </div>
      )}
    </>
  );
};

export default MapWithPath;
