import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// Fetch cateogories from the API
export const getD3Categories = async () => {
  const response = await axios.get(`${API_URL}/dashboard_3_categories`);
  return response.data; // Return the data received from the API
};

// Fetch materials data for a specific category using a POST request
export const getD3Materials = async (year, category_id) => {
  const response = await axios.post(
    `${API_URL}/dashboard_3_matnr_maktx`,
    {
      year: year, // Pass the year value in the request body
      category_id: String(category_id), // Pass the category ID value in the request body
    },
    { timeout: 5000 }
  );
  return response.data;
};

// Fetch average spend data for a specific year and category using a POST request
export const getD3CategoryPriceTable = async (year, category_id) => {
  const response = await axios.post(
    `${API_URL}/dashboard_3_get_price_group`,
    {
      year: year, // Pass the year value in the request body
      category_id: String(category_id), // Pass the category ID value in the request body
    },
    { timeout: 5000 }
  );
  return response.data;
};

// Fetch average spend data for a specific year and category using a POST request
export const getD3MaterialPriceGroupDistrict = async (year, matnr) => {
  const response = await axios.post(
    `${API_URL}/dashboard_3_get_price_details`,
    {
      year: year, // Pass the year value in the request body
      matnr: String(matnr), // Pass the matnr value in the request body
    },
    { timeout: 5000 }
  );
  return response.data;
};

export const getD3MaterialPriceByDistrict = async (year, matnr) => {
  const response = await axios.post(
    `${API_URL}/dashboard_3_get_price_by_district`,
    {
      year: year, // Pass the year value in the request body
      matnr: String(matnr), // Pass the matnr value in the request body
    },
    { timeout: 5000 }
  );
  return response.data;
};

export const getD3MaterialPriceGroupEKGRP = async (year, matnr, district) => {
  const response = await axios.post(
    `${API_URL}/dashboard_3_get_price_details_district`,
    {
      year: year, // Pass the year value in the request body
      matnr: String(matnr), // Pass the matnr value in the request body
      district: String(district),
    },
    { timeout: 5000 }
  );
  return response.data;
};

// Fetch cateogories from the API for dashboard 3
export const getD3Districts = async (year, matnr) => {
  const response = await axios.post(
    `${API_URL}/dashboard_3_get_districts`,
    {
      year: year, // Pass the year value in the request body
      matnr: String(matnr), // Pass the matnr value in the request body
    },
    { timeout: 5000 }
  );
  return response.data; // Return the data received from the API
};

// Fetch average spend data for a specific year and category using a POST request
export const getD3MaterialPriceByEKGRP = async (year, matnr, district) => {
  const response = await axios.post(
    `${API_URL}/dashboard_3_get_price_by_subregion`,
    {
      year: year, // Pass the year value in the request body
      matnr: String(matnr), // Pass the matnr value in the request body
      district: String(district), // Pass the matnr value in the request body
    },
    { timeout: 5000 }
  );
  return response.data;
};
