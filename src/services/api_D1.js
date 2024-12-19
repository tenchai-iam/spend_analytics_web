import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

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
    `${API_URL}/dashboard_1_vendor_month_by_year`,
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
    `${API_URL}/dashboard_1_vendor_by_year`,
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
    `${API_URL}/dashboard_1_spend_po_by_ekgrp`,
    {
      year: year, // Pass the year value in the request body
    },
    { timeout: 5000 }
  );
  return response.data;
};
