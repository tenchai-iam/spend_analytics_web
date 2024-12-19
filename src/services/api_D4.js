import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// Fetch cateogories from the API
export const getD4Categories = async (priority) => {
  const response = await axios.post(
    `${API_URL}/get_category_group_name`,
    {
      priority: String(priority), // Pass the category ID value in the request body
    },
    { timeout: 5000 }
  );
  return response.data;
};

// Fetch materials data for a specific category using a POST request
export const getD4Materials = async (year, category_id, priority) => {
  const response = await axios.post(
    `${API_URL}/dashboard_4_matnr_maktx`,
    {
      year: year, // Pass the year value in the request body
      category_id: String(category_id),
      priority: String(priority), // Pass the category ID value in the request body
    },
    { timeout: 5000 }
  );
  return response.data;
};

export const getD4UsableMaterialGroup = async (year) => {
  const response = await axios.post(
    `${API_URL}/dashboard_4_get_useable`,
    {
      year: year, // Pass the year value in the request body
    },
    { timeout: 5000 }
  );
  return response.data;
};

export const getD4RequireMaterialDetail = async (year, priority) => {
  const response = await axios.post(
    `${API_URL}/dashboard_4_get_detailed_usability`,
    {
      year: year, // Pass the year value in the request body
      priority: priority,
    },
    { timeout: 5000 }
  );
  return response.data;
};

export const getD4SimMaterialPlan = async (
  year,
  hq_leadtime,
  demand_month,
  matnr
) => {
  try {
    const payload = {
      year: year, // Ensure year is a string
      hq_leadtime: String(hq_leadtime), // Send lead time as a string
      demand_month: String(demand_month), // Send demand month as a string
      matnr: String(matnr), // Ensure matnr is a string
    };

    console.log("Request Payload:", payload); // Debug: Log payload

    const response = await axios.post(
      `${API_URL}/dashboard_4_get_data_budget`,
      payload,
      {
        headers: { "Content-Type": "application/json" }, // Ensure headers match
        timeout: 5000,
      }
    );

    console.log("API Response:", response.data); // Debug: Log API response
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching simMaterialPlan data:",
      error.response?.data || error.message
    );
    throw error; // Ensure error is propagated
  }
};
