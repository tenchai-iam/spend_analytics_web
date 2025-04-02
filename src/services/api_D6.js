import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// Fetch target monthly inventory target from the API
export const getTargetInventoryMonth = async (year, month, category_group) => {
  const response = await axios.post(
    `${API_URL}/inventoryYearTarget`,
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
    `${API_URL}/inventoryMonth`,
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
    `${API_URL}/inventoryMonthYOYTarget`,
    {
      year: year, // Pass the year value in the request body
    },
    { timeout: 5000 }
  );
  return response.data;
};

export const getCurrentInventoryDay = async (year, category_group) => {
  const response = await axios.post(
    `${API_URL}/inventoryDay`,
    {
      year: year, // Pass the year value in the request body
      category_group: String(category_group), // Pass the category group value in the request body
    },
    { timeout: 5000 }
  );
  return response.data;
};

export const getD6Month = async (year) => {
  const response = await axios.post(
    `${API_URL}/get_month_select`,
    {
      year: year, // Pass the year value in the request body
    },
    { timeout: 5000 }
  );
  return response.data;
};

export const getTargetInventoryMonthPlant = async (year, district) => {
  const response = await axios.post(
    `${API_URL}/inventoryYearTargetByPlant`,
    {
      year: year, // Pass the year value in the request body
      district: district,
    },
    { timeout: 5000 }
  );
  return response.data;
};

export const getCurrentInventoryMonthPlant = async (
  year,
  month,
  category_group,
  district
) => {
  const response = await axios.post(
    `${API_URL}/inventoryMonthByPlant`,
    {
      year: year, // Pass the year value in the request body
      month: month,
      category_group: String(category_group),
      district: district,
    },
    { timeout: 5000 }
  );
  return response.data;
};

export const getTargetInventoryDayPlant = async (
  year,
  category_group,
  district
) => {
  const response = await axios.post(
    `${API_URL}/inventoryMonthYOYTargetByPlant`,
    {
      year: year, // Pass the year value in the request body
      district: district,
    },
    { timeout: 5000 }
  );
  return response.data;
};

export const getCurrentInventoryDayPlant = async (
  year,
  category_group,
  district
) => {
  const response = await axios.post(
    `${API_URL}/inventoryDayByPlant`,
    {
      year: year, // Pass the year value in the request body
      category_group: String(category_group), // Pass the category group value in the request body
      district: district,
    },
    { timeout: 5000 }
  );
  return response.data;
};
