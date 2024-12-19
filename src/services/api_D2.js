import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// Fetch top supplier data for a specific year and category using a POST request
export const getD2TopSupplier = async (year, category_group) => {
  const response = await axios.post(
    `${API_URL}/get_top_suppliers_by_year_and_category`,
    {
      year: year, // Pass the year value in the request body
      category_group: String(category_group), // Pass the category ID value in the request body
    },
    { timeout: 5000 }
  );
  return response.data;
};

// Fetch total spend data for a specific year and category using a POST request
export const getD2CategorySpendByValue = async (year, category_group) => {
  const response = await axios.post(
    `${API_URL}/dashboard_2_get_spend_by_category_value`,
    {
      year: year, // Pass the year value in the request body
      category_group: String(category_group), // Pass the category ID value in the request body
    },
    { timeout: 5000 }
  );
  return response.data;
};

// Fetch PO quantity data for a specific year and category using a POST request
export const getD2CategoryPOQuantityByValue = async (year, category_group) => {
  const response = await axios.post(
    `${API_URL}/dashboard_2_get_po_by_category_value`,
    {
      year: year, // Pass the year value in the request body
      category_group: String(category_group), // Pass the category ID value in the request body
    },
    { timeout: 5000 }
  );
  return response.data;
};

// Fetch average spend data for a specific year and category using a POST request
export const getD2CategoryAverageSpendByValue = async (
  year,
  category_group
) => {
  const response = await axios.post(
    `${API_URL}/dashboard_2_get_spend_by_po_category_value`,
    {
      year: year, // Pass the year value in the request body
      category_group: String(category_group), // Pass the category ID value in the request body
    },
    { timeout: 5000 }
  );
  return response.data;
};

export const getD2CategorySpendByPO = async (year, category_group) => {
  const response = await axios.post(
    `${API_URL}/dashboard_2_get_spend_by_po_value`,
    {
      year: year, // Pass the year value in the request body
      category_group: String(category_group), // Pass the category ID value in the request body
    },
    { timeout: 5000 }
  );
  return response.data;
};

// Fetch PO quantity data for a specific year and category using a POST request
export const getD2CategoryPOQuantityByPO = async (year, category_group) => {
  const response = await axios.post(
    `${API_URL}/dashboard_2_get_po_by_po_value`,
    {
      year: year, // Pass the year value in the request body
      category_group: String(category_group), // Pass the category ID value in the request body
    },
    { timeout: 5000 }
  );
  return response.data;
};

// Fetch average spend data for a specific year and category using a POST request
export const getD2CategoryAverageSpendByPO = async (year, category_group) => {
  const response = await axios.post(
    `${API_URL}/dashboard_2_get_spend_by_po_by_po_value`,
    {
      year: year, // Pass the year value in the request body
      category_group: String(category_group), // Pass the category ID value in the request body
    },
    { timeout: 5000 }
  );
  return response.data;
};

export const getD2CategorySpendByAveragePO = async (year, category_group) => {
  const response = await axios.post(
    `${API_URL}/dashboard_2_get_spend_by_sbp_value`,
    {
      year: year, // Pass the year value in the request body
      category_group: String(category_group), // Pass the category ID value in the request body
    },
    { timeout: 5000 }
  );
  return response.data;
};

// Fetch PO quantity data for a specific year and category using a POST request
export const getD2CategoryPOQuantityByAveragePO = async (
  year,
  category_group
) => {
  const response = await axios.post(
    `${API_URL}/dashboard_2_get_po_by_sbp_value`,
    {
      year: year, // Pass the year value in the request body
      category_group: String(category_group), // Pass the category ID value in the request body
    },
    { timeout: 5000 }
  );
  return response.data;
};

// Fetch average spend data for a specific year and category using a POST request
export const getD2CategoryAverageSpendByAveragePO = async (
  year,
  category_group
) => {
  const response = await axios.post(
    `${API_URL}/dashboard_2_get_spend_by_po_by_sbp_value`,
    {
      year: year, // Pass the year value in the request body
      category_group: String(category_group), // Pass the category ID value in the request body
    },
    { timeout: 5000 }
  );
  return response.data;
};
