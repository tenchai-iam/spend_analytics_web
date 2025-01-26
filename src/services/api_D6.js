import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// Fetch target monthly inventory target from the API
export const getPreviousInventoryMonth = async (
  year,
  month,
  category_group
) => {
  const response = await axios.post(
    `${API_URL}/get_inventory_previous_month`,
    {
      year: year, // Pass the year value in the request body
      month: month,
      category_group: String(category_group), // Pass the category group value in the request body
    },
    { timeout: 5000 }
  );
  return response.data;
};

export const getCurrentInventoryMonth = async (year, month, category_group) => {
  const response = await axios.post(
    `${API_URL}/get_inventory_by_month`,
    {
      year: year, // Pass the year value in the request body
      month: month,
      category_group: String(category_group), // Pass the category group value in the request body
    },
    { timeout: 5000 }
  );
  return response.data;
};

export const getTargetInventoryDay = async (year, category_group) => {
  const response = await axios.post(
    `${API_URL}/get_inventory_by_group`,
    {
      year: year, // Pass the year value in the request body
      category_group: String(category_group), // Pass the category group value in the request body
    },
    { timeout: 5000 }
  );
  return response.data;
};

export const getCurrentInventoryDay = async (year, category_group) => {
  const response = await axios.post(
    `${API_URL}/get_inventory_use_plant`,
    {
      year: year, // Pass the year value in the request body
      category_group: String(category_group), // Pass the category group value in the request body
    },
    { timeout: 5000 }
  );
  return response.data;
};
