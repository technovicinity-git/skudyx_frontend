"use client";
import { useEffect, useState, useMemo } from "react";
import AsyncSelect from "react-select/async";

// eslint-disable-next-line no-undef
const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const AddressAutocomplete = ({ onChange, value = "" }) => {
  const [service, setService] = useState(null);

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = () => {
        setService(new window.google.maps.places.AutocompleteService());
      };
      document.body.appendChild(script);
    } else {
      setService(new window.google.maps.places.AutocompleteService());
    }
  }, []);

  // Core API call
  const fetchPredictions = (inputValue) =>
    new Promise((resolve) => {
      if (!inputValue || !service) return resolve([]);
      service.getPlacePredictions(
        { input: inputValue, componentRestrictions: { country: "ng" } },
        (predictions) => {
          if (!predictions) return resolve([]);
          resolve(
            predictions.map((p) => ({
              value: p.place_id,
              label: p.description,
            }))
          );
        }
      );
    });

  // Debounce helper
  const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      return new Promise((resolve) => {
        timeoutId = setTimeout(() => resolve(fn(...args)), delay);
      });
    };
  };

  // Wrap fetchPredictions in debounce (500ms)
  const loadOptions = useMemo(() => debounce(fetchPredictions, 500), [service]);

  return (
    <AsyncSelect
      cacheOptions
      loadOptions={loadOptions}
      value={value ? { label: value, value: value } : null}
      onChange={onChange}
      placeholder="Search for an address"
      styles={{
        control: (base, state) => ({
          ...base,
          minHeight: "48px", // 🔑 increase height
          height: "48px",
          borderRadius: "0.5rem", // keep rounded corners
          borderColor: state.isFocused ? "#4F46E5" : "#d1d5db", // indigo-600 on focus
          boxShadow: state.isFocused ? "0 0 0 1px #4F46E5" : "none",
          "&:hover": { borderColor: "#9ca3af" }, // gray-400
        }),
        valueContainer: (base) => ({
          ...base,
          height: "48px", // align text inside taller input
          padding: "0 8px",
        }),
        input: (base) => ({
          ...base,
          margin: 0,
          padding: 0,
        }),
        indicatorsContainer: (base) => ({
          ...base,
          height: "48px", // align dropdown arrow/clear button
        }),
      }}
    />
  );
};

export default AddressAutocomplete;
