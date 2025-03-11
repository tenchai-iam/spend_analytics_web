import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getYearsD5 } from "../services/api_D5.js"; // Import the getYears function
import "../ComponentsStyles/YearDropdown.css";

const YearDropdownD5 = ({ onSelectYear, selectedYear }) => {
  // Use React Query's useQuery to fetch years
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["YEARS"],
    queryFn: getYearsD5,
  });

  // Set the default year to the most recent one once data is fetched
  useEffect(() => {
    if (data && data?.YEARS?.length > 0 && !selectedYear) {
      const mostRecentYear = Math.max(...data.YEARS); // Get the most recent year
      onSelectYear(mostRecentYear.toString()); // Set the most recent year as default
    }
  }, [data, onSelectYear, selectedYear]);

  // Handle loading and error states using React Query's properties
  if (isLoading) return <div>Loading years...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  const handleChange = (e) => {
    const selectedYear = e.target.value;
    onSelectYear(selectedYear); // Notify parent component when a year is selected
  };

  return (
    <div>
      <label htmlFor="year-select">เลือกปีที่แสดง</label>
      <select id="year-select" value={selectedYear} onChange={handleChange}>
        <option value="" disabled>
          -- Select a Year --
        </option>
        {data?.YEARS?.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default YearDropdownD5;
