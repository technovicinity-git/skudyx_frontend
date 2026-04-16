"use client";

export default function MapWithCoords({ coords }) {
  const lat = coords?.[0]?.[1];
  const lng = coords?.[0]?.[0];

  if (!lat || !lng) {
    return (
      <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-gray-100 text-gray-400 text-sm rounded-xl">
        Location not available
      </div>
    );
  }

  const mapUrl = `https://www.google.com/maps?q=${lat},${lng}&output=embed`;

  return (
    <div className="w-full h-full min-h-[300px] sm:min-h-[400px] rounded-xl overflow-hidden">
      <iframe
        src={mapUrl}
        className="w-full h-full"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
