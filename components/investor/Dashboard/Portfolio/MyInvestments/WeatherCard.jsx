"use client";
import Button from "@/components/common/Button";
import { formatDate } from "@/utils/formatDate";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useState } from "react";

export const WeatherCard = ({ data }) => {
  const [index, setIndex] = useState(0);
  const day = data[index];

  const handlePrev = () => {
    setIndex((prev) => (prev > 0 ? prev - 1 : data.length - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev < data.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="w-full bg-white rounded-2xl overflow-hidden">
      <div className="bg-green-800 text-white text-center py-4">
        <h2 className="text-lg font-bold">Weather Data</h2>
        <p className="text-sm">{formatDate(day?.Date)}</p>
      </div>

      <div className="p-6 flex flex-col items-center">
        {/* Temperature */}
        <div className="flex items-center gap-6 mb-4">
          <div className="flex flex-col items-center">
            <span className="text-4xl">🌡️</span>
            <p className="text-sm text-gray-600">Air Temp</p>
            <p className="font-bold">
              {day.Temp_air_min?.toFixed(1)}° - {day.Temp_air_max?.toFixed(1)}°
            </p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl">🌍</span>
            <p className="text-sm text-gray-600">Land Temp</p>
            <p className="font-bold">
              {day.Temp_land_min?.toFixed(1)}° - {day.Temp_land_max?.toFixed(1)}
              °
            </p>
          </div>
        </div>

        {/* Humidity, Rain, Wind */}
        <div className="grid grid-cols-3 gap-4 text-center w-full mb-4">
          <div>
            <span className="text-3xl">💧</span>
            <p className="text-sm text-gray-600">Humidity</p>
            <p className="font-bold">{day?.Rel_humidity?.toFixed(0)}%</p>
          </div>
          <div>
            <span className="text-3xl">🌧️</span>
            <p className="text-sm text-gray-600">Rain (17h)</p>
            <p className="font-bold">{day?.Rain["17h"]?.toFixed(1)} mm</p>
          </div>
          <div>
            <span className="text-3xl">💨</span>
            <p className="text-sm text-gray-600">Wind (14h)</p>
            <p className="font-bold">{day?.Windspeed["14h"]?.toFixed(1)} m/s</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex w-full items-center justify-between border-t px-6 pt-4 mt-4">
          <Button
            onClick={handlePrev}
            variant="outline"
            className="flex items-center gap-1"
          >
            <ArrowBack fontSize="small" /> Prev
          </Button>
          <Button
            onClick={handleNext}
            variant="outline"
            className="flex items-center gap-1"
          >
            Next <ArrowForward fontSize="small" />
          </Button>
        </div>
      </div>
    </div>
  );
};
