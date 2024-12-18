import axios from "axios";

const API_URL = "https://spendi-tcc.pea.co.th/api";

// Fetch years from the API
export const getYears = async () => {
  const response = await axios.get(`${API_URL}/get_years`);
  return response.data; // Return the data received from the API
};

// Fetch datadate from the API
export const getDateInfo = async (datadate) => {
  const response = await axios.post(
    `${API_URL}/get_date_info`,
    {
      datadate: datadate, // Pass the data format value in the request body
    },
    { timeout: 5000 }
  );
  return response.data; // Return the data received from the API
};

// Fetch cateogories from the API
export const getCategory = async () => {
  const response = await axios.get(`${API_URL}/get_category`);
  return response.data; // Return the data received from the API
};

// Fetch home dashboard data for a specific year using a POST request
export const getHomeData = async (year) => {
  const response = await axios.post(
    `${API_URL}/get_summary_by_year`,
    {
      year: year, // Pass the year value in the request body
    },
    { timeout: 5000 }
  );
  return response.data;
};