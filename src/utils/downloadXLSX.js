import XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";

/**
 * Generic XLSX download utility with formatting
 * @param {Object} config - Configuration object containing all parameters
 * @param {Array} config.data - The data to export (raw unformatted data)
 * @param {Array} config.headers - Headers configuration with label and key
 * @param {String} config.fileName - Name of the file to download
 * @param {String} config.title - Main title for the spreadsheet
 * @param {Array} config.filters - Array of filter descriptions (e.g., ["Year: 2024", "Category: 001"])
 * @param {Object} config.dateInfo - Date information object
 * @param {Object} config.columnAlignment - Optional column alignment overrides
 * @param {Object} config.columnTypes - Optional column types ('text', 'number', 'percentage', 'currency')
 * @param {Object} config.preserveRawNumbers - If true, uses raw numeric values for specified columns
 */
export const downloadXLSX = (config) => {
  const {
    data,
    headers,
    fileName,
    title,
    filters = [],
    dateInfo = {},
    columnAlignment = {},
    columnTypes = {},
    preserveRawNumbers = false
  } = config;

  // Format data with headers - handle numeric types
  const formattedData = data.map((item) =>
    headers.reduce((acc, header, index) => {
      let value = item[header.key];
      
      // If preserveRawNumbers is true and column type is numeric, keep raw value
      if (preserveRawNumbers && columnTypes[index]) {
        const type = columnTypes[index];
        if (type === 'number' || type === 'currency' || type === 'percentage') {
          // For percentage type, ensure the raw value is decimal (0.1 for 10%)
          if (type === 'percentage' && typeof value === 'string' && value.includes('%')) {
            value = parseFloat(value.replace('%', '')) / 100;
          } else if (typeof value === 'string') {
            // Remove formatting from string numbers
            value = parseFloat(value.replace(/,/g, ''));
          }
          // Keep numeric value for Excel
          acc[header.label] = isNaN(value) ? item[header.key] : value;
        } else {
          acc[header.label] = item[header.key];
        }
      } else {
        // Use formatted string value
        acc[header.label] = item[header.key];
      }
      
      return acc;
    }, {})
  );

  // Calculate number of extra rows needed
  const titleRows = title ? 1 : 0;
  const filterRows = filters.length;
  const spacing = 1; // Space between title/filters and table
  const extraRowsAbove = Array(titleRows + filterRows + spacing + 1).fill({});
  const extraRowsBelow = Array(2).fill({}); // For date info

  // Combine all rows
  const headerRow = headers.reduce((acc, header) => {
    acc[header.label] = header.label;
    return acc;
  }, {});
  
  const fullData = [
    ...extraRowsAbove,
    headerRow,
    ...formattedData,
    ...extraRowsBelow,
  ];

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(fullData, { skipHeader: true });
  const workbook = XLSX.utils.book_new();

  // Calculate merge ranges
  const numColumns = headers.length;
  const merges = [];
  
  // Add title merge if title exists
  if (title) {
    merges.push({ s: { r: 1, c: 0 }, e: { r: 1, c: numColumns - 1 } });
  }

  // Add filter merges
  filters.forEach((_, index) => {
    const rowIndex = titleRows + 1 + index;
    merges.push({ s: { r: rowIndex, c: 0 }, e: { r: rowIndex, c: numColumns - 1 } });
  });

  // Add date info merge
  merges.push({
    s: { r: fullData.length - 1, c: 0 },
    e: { r: fullData.length - 1, c: numColumns - 1 },
  });

  worksheet["!merges"] = merges;

  // Add title text
  if (title) {
    worksheet["A2"] = { v: title };
    worksheet["A2"].s = {
      font: { bold: true, sz: 16 },
      alignment: { horizontal: "center", vertical: "center" },
    };
  }

  // Add filter texts
  filters.forEach((filter, index) => {
    const rowIndex = titleRows + 2 + index;
    const cellAddress = `A${rowIndex}`;
    worksheet[cellAddress] = { v: filter };
    worksheet[cellAddress].s = {
      font: { sz: 12 },
      alignment: { horizontal: "left", vertical: "center" },
    };
  });

  // Add date info
  const infoRowIndex = fullData.length;
  const dateText = dateInfo.day 
    ? `ข้อมูล ณ วันที่ ${dateInfo.day}/${dateInfo.month}/${dateInfo.year} เวลา ${String(dateInfo.hour).padStart(2, '0')}:${String(dateInfo.minute).padStart(2, '0')} น.`
    : "";
  
  if (dateText) {
    worksheet[`A${infoRowIndex}`] = { v: dateText };
    worksheet[`A${infoRowIndex}`].s = {
      font: { sz: 12 },
      alignment: { horizontal: "left", vertical: "center" },
    };
  }

  // Style headers
  const headerRowIndex = extraRowsAbove.length;
  for (let C = 0; C < headers.length; C++) {
    const cellAddress = XLSX.utils.encode_cell({ r: headerRowIndex, c: C });
    if (!worksheet[cellAddress]) {
      worksheet[cellAddress] = { v: headers[C]?.label || "" };
    }
    worksheet[cellAddress].s = {
      font: { bold: true },
      alignment: {
        horizontal: "center",
        vertical: "center",
        wrapText: true,
      },
      fill: { fgColor: { rgb: "D9D9D9" } },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      },
    };
  }

  // Style data cells
  for (let R = headerRowIndex + 1; R < fullData.length - extraRowsBelow.length; ++R) {
    for (let C = 0; C < headers.length; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      if (!worksheet[cellAddress]) continue;

      // Determine alignment
      let horizontalAlignment = "center";
      
      // Check for custom alignment
      if (columnAlignment[C] !== undefined) {
        horizontalAlignment = columnAlignment[C];
      } else {
        // Default alignment logic
        if (C === 0) {
          horizontalAlignment = "center";
        } else if (C === 1) {
          horizontalAlignment = "left";
        } else {
          horizontalAlignment = "right";
        }
      }

      // Base style
      const cellStyle = {
        alignment: {
          horizontal: horizontalAlignment,
          vertical: "center",
          wrapText: true,
        },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
      };

      // Apply number format if specified
      if (preserveRawNumbers && columnTypes[C]) {
        const type = columnTypes[C];
        
        // Set cell type and format
        if (type === 'number') {
          worksheet[cellAddress].t = 'n'; // number type
          cellStyle.numFmt = '#,##0'; // thousands separator, no decimals
        } else if (type === 'currency') {
          worksheet[cellAddress].t = 'n'; // number type
          cellStyle.numFmt = '#,##0.00'; // thousands separator with 2 decimals
        } else if (type === 'percentage') {
          worksheet[cellAddress].t = 'n'; // number type
          cellStyle.numFmt = '0.00%'; // percentage with 2 decimals
        }
      }

      worksheet[cellAddress].s = cellStyle;
    }
  }

  // Calculate column widths
  const colWidths = headers.map((header) => {
    const columnData = [
      header.label,
      ...formattedData.map((row) => row[header.label]?.toString() || ""),
    ];
    const maxLength = columnData.reduce(
      (max, value) => Math.max(max, value.length),
      0
    );
    return { wch: Math.min(maxLength + 2, 50) }; // Cap at 50 chars
  });
  worksheet["!cols"] = colWidths;

  // Write and download
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  const xlsxData = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([xlsxData], { type: "application/octet-stream" });
  saveAs(blob, `${fileName}.xlsx`);
};

/**
 * Format helper functions
 */
export const formatters = {
  price: (value) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value),
    
  quantity: (value) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value),
    
  percentage: (value) =>
    new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value),
};