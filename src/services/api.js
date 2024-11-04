import axios from "axios";

const API_URL = "https://cardinal-analytic-spend.thepostway.com/api";

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

// Fetch cateogories from the API
export const getCategories = async () => {
  const response = await axios.get(`${API_URL}/dashboard_3_categories`);
  return response.data; // Return the data received from the API
};

// Fetch cateogories from the API
export const getD4Categories = async () => {
  const response = await axios.get(`${API_URL}/dashboard_3_categories`);
  return response.data; // Return the data received from the API
};

// Fetch materials data for a specific category using a POST request
export const getMaterials = async (year, category_id) => {
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

// Fetch materials data for a specific category using a POST request
export const getD4Materials = async (year, category_id) => {
  const response = await axios.post(
    `${API_URL}/dashboard_4_matnr_maktx`,
    {
      year: year, // Pass the year value in the request body
      category_id: String(category_id), // Pass the category ID value in the request body
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

// Fetch top 10 spend diff supplier data for a specific year using a POST request
export const getD1Top10SpendDiff = async (year, category_id) => {
  const response = await axios.post(
    `${API_URL}/dashboard_1_get_top_10_price_diff_by_year`,
    {
      year: year, // Pass the year value in the request body
      category_id: category_id,
    },
    { timeout: 5000 }
  );
  return response.data;
};

// Fetch top 5 spend diff supplier data for a specific year using a POST request
export const getD1Top5POValue = async (year) => {
  const response = await axios.post(
    `${API_URL}/dashboard_1_get_top_5_districts`,
    {
      year: year, // Pass the year value in the request body
    },
    { timeout: 5000 }
  );
  return response.data;
};

// Fetch monthly spend data for a specific year using a POST request
export const getD1LineSpend = async (year) => {
  const response = await axios.post(
    `${API_URL}/dashboard_1_spend_month_by_year`,
    {
      year: year, // Pass the year value in the request body
    },
    { timeout: 5000 }
  );
  return response.data;
};

// Fetch yearly spend data for a specific year using a POST request
export const getD1BarSpend = async (year) => {
  const response = await axios.post(
    `${API_URL}/dashboard_1_spend_by_year`,
    {
      year: year, // Pass the year value in the request body
    },
    { timeout: 5000 }
  );
  return response.data;
};

// Fetch monthly PO data for a specific year using a POST request
export const getD1LinePOQuantity = async (year) => {
  const response = await axios.post(
    `${API_URL}/dashboard_1_po_month_by_year`,
    {
      year: year, // Pass the year value in the request body
    },
    { timeout: 5000 }
  );
  return response.data;
};

// Fetch yearly po quantity data for a specific year using a POST request
export const getD1BarPurchaseQ = async (year) => {
  const response = await axios.post(
    `${API_URL}/dashboard_1_po_by_year`,
    {
      year: year, // Pass the year value in the request body
    },
    { timeout: 5000 }
  );
  return response.data;
};

// Fetch monthly supplier data for a specific year using a POST request
export const getD1LineSupplierQuantity = async (year) => {
  const response = await axios.post(
    `${API_URL}/dashboard_1_supplier_month_by_year`,
    {
      year: year, // Pass the year value in the request body
    },
    { timeout: 5000 }
  );
  return response.data;
};

// Fetch yearly supplier quanity data for a specific year using a POST request
export const getD1BarSupplierQ = async (year) => {
  const response = await axios.post(
    `${API_URL}/dashboard_1_supplier_by_year`,
    {
      year: year, // Pass the year value in the request body
    },
    { timeout: 5000 }
  );
  return response.data;
};

// Fetch yearly spend data by category for a specific year using a POST request
export const getD1CategorySpend = async (year) => {
  const response = await axios.post(
    `${API_URL}/dashboard_1_spend_category_by_year`,
    {
      year: year, // Pass the year value in the request body
    },
    { timeout: 5000 }
  );
  return response.data;
};

// Fetch yearly spend data by department for a specific year using a POST request
export const getD1DonutSpend = async (year) => {
  const response = await axios.post(
    `${API_URL}/dashboard_1_spend_by_ekgrp_donut`,
    {
      year: year, // Pass the year value in the request body
    },
    { timeout: 5000 }
  );
  return response.data;
};

// Fetch yearly spend data and number of PO by district for a specific year using a POST request
export const getD1PONumSpend = async (year) => {
  const response = await axios.post(
    `${API_URL}/dashboard_1_get_spend_region_map`,
    {
      year: year, // Pass the year value in the request body
    },
    { timeout: 5000 }
  );
  return response.data;
};

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
export const getD2CategorySpend = async (year, category_group) => {
  const response = await axios.post(
    `${API_URL}/dashboard_2_get_spend_by_category`,
    {
      year: year, // Pass the year value in the request body
      category_group: String(category_group), // Pass the category ID value in the request body
    },
    { timeout: 5000 }
  );
  return response.data;
};

// Fetch PO quantity data for a specific year and category using a POST request
export const getD2CategoryPOQuantity = async (year, category_group) => {
  const response = await axios.post(
    `${API_URL}/dashboard_2_get_po_quantity_by_category`,
    {
      year: year, // Pass the year value in the request body
      category_group: String(category_group), // Pass the category ID value in the request body
    },
    { timeout: 5000 }
  );
  return response.data;
};

// Fetch average spend data for a specific year and category using a POST request
export const getD2CategoryAverageSpend = async (year, category_group) => {
  const response = await axios.post(
    `${API_URL}/dashboard_2_get_spend_per_po_by_category`,
    {
      year: year, // Pass the year value in the request body
      category_group: String(category_group), // Pass the category ID value in the request body
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