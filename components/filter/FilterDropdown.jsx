import React, { useState } from "react";
import { ChevronDown, Filter } from "lucide-react";
import Button from "../common/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./DropDownMenuContent";

// Reusable FilterDropdown Component
const FilterDropdown = ({ options = [], defaultValue = "", onChange }) => {
  const [filter, setFilter] = useState(defaultValue);

  const filters = options.length
    ? options
    : [
        { label: "All", value: "" },
        { label: "Active", value: "active" },
        { label: "Completed", value: "completed" },
        { label: "Archived", value: "archived" },
      ];

  const selected = filters?.find((f) => f.value === filter)?.label || "All";

  const handleSelect = (value) => {
    setFilter(value);
    if (onChange) onChange(value);
  };

  return (
    <div className="flex items-center justify-center p-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 rounded-2xl shadow-sm hover:shadow-md transition-all"
          >
            <Filter className="w-4 h-4" />
            <span className="font-medium">{selected}</span>
            <ChevronDown className="w-4 h-4 opacity-70" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-44 rounded-2xl shadow-lg p-2">
          <DropdownMenuLabel>Filter by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {filters.map((item) => (
            <DropdownMenuItem
              key={item.value}
              onClick={() => handleSelect(item.value)}
              className={`rounded-lg cursor-pointer transition-colors ${
                filter === item.value ? "bg-gray-100 font-semibold" : ""
              }`}
            >
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default FilterDropdown;
