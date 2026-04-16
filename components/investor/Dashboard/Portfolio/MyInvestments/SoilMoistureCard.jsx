import Button from "@/components/common/Button";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useState } from "react";

const SoilMoistureCard = ({ data }) => {
  const [index, setIndex] = useState(0);
  const day = data[index];

  const handleNext = () => {
    if (index < data.length - 1) setIndex(index + 1);
  };

  const handlePrev = () => {
    if (index > 0) setIndex(index - 1);
  };

  const convertDate = (dateStr) => {
    const date = new Date(dateStr);

    // add 7 days
    date.setDate(date.getDate() + 7);

    // format to DD/MM/YYYY
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  return (
    <div className=" mx-auto bg-white rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-green-800 text-white text-center py-4">
        <h2 className="text-lg font-bold">Soil Moisture Data</h2>
        <p className="text-sm">{convertDate(day?.date)}</p>
      </div>

      {/* Stats */}
      <div className="p-6 grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-gray-500 text-sm">Min</p>
          <p className="text-lg font-semibold">{day?.min?.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Max</p>
          <p className="text-lg font-semibold">{day?.max?.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Average</p>
          <p className="text-lg font-semibold">{day?.average?.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Median</p>
          <p className="text-lg font-semibold">{day?.median?.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Q1</p>
          <p className="text-lg font-semibold">{day?.q1?.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Q3</p>
          <p className="text-lg font-semibold">{day?.q3?.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Std Dev</p>
          <p className="text-lg font-semibold">{day?.std?.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Variance</p>
          <p className="text-lg font-semibold">{day?.variance?.toFixed(2)}</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between px-6 py-4 border-t">
        <Button
          onClick={handlePrev}
          disabled={index === 0}
          variant="outline"
          className="px-4 py-2 rounded-lg font-medium transition hover:bg-gray-200"
        >
          <ArrowBack fontSize="small" /> Prev
        </Button>
        <Button
          onClick={handleNext}
          disabled={index === data.length - 1}
          variant="outline"
          className="px-4 py-2 rounded-lg font-medium transition hover:bg-gray-200"
        >
          Next <ArrowForward fontSize="small" />
        </Button>
      </div>
    </div>
  );
};

export default SoilMoistureCard;
