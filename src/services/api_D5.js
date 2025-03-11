import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// Fetch years from the API
export const getYearsD5 = async () => {
  const response = await axios.get(`${API_URL}/dash5_get_year`);
  return response.data; // Return the data received from the API
};

// Fetch baseline, normalized and actual value for planned from the API
export const getPlannedValue = async (year) => {
  const response = await axios.post(
    `${API_URL}/planned_PI_stage5_value`,
    {
      year: year, // Pass the year value in the request body
    },
    { timeout: 5000 }
  );
  return response.data;
};

// Fetch baseline, normalized and actual value for planned from the API
export const getPlannedValueSummary = async (year) => {
  const response = await axios.post(
    `${API_URL}/planned_PI_stage5_value_summary`,
    {
      year: year, // Pass the year value in the request body
    },
    { timeout: 5000 }
  );
  return response.data;
};

// Fetch baseline, normalized and actual value for planned from the API
export const getUnplannedValue = async (year) => {
  const response = await axios.post(
    `${API_URL}/unplanned_PI_stage5_value`,
    {
      year: year, // Pass the year value in the request body
    },
    { timeout: 5000 }
  );
  return response.data;
};

// Fetch baseline, normalized and actual value for planned from the API
export const getUnplannedValueSummary = async (year) => {
  const response = await axios.post(
    `${API_URL}/unplanned_PI_stage5_value_summary`,
    {
      year: year, // Pass the year value in the request body
    },
    { timeout: 5000 }
  );
  return response.data;
};
