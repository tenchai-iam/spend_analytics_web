import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

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
