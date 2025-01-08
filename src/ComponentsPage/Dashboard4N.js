import React, { useState, useEffect } from "react";
import NavbarComponent from "../ComponentsPage/NavbarComponent";
import "../ComponentsStyles/Dashboard4.css"; // Updated to use Dashboard3.css
import YearDropdown from "./YearDropdown";
import Table4 from "./Table4.js";
import D4DonutChartRe from "./D4DonutChartRe.js";
import TableD42 from "./TableD42.js";
import D4GroupBarRe from "./D4GroupBarRe";
import Select from "react-select"; // Import react-select
import { useQuery } from "@tanstack/react-query";
import { getYears, getDateInfo } from "../services/api.js"; // Import your API service function
import {
  getD4Categories,
  getD4Materials,
  getD4UsableMaterialGroup,
  getD4RequireMaterialDetail,
  getD4SimMaterialPlan,
} from "../services/api_D4.js";
import { CSVLink } from "react-csv"; // Import CSVLink from react-csv
import XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";

const Dashboard4 = () => {
  const [selectedYear, setSelectedYear] = useState(""); // State to hold the selected year
  const [selectedMaterialGroup, setSelectedMaterialGroup] = useState("High");
  const [selectedCategory, setSelectedCategory] = useState(""); // State to hold the selected category
  const [selectedMaterial, setSelectedMaterial] = useState(""); // State to hold the selected material
  const [selectedHQLeadTime, setSelectedHQLeadTime] = useState(null);
  const [selectedDemandMonth, setSelectedDemandMonth] = useState(null);

  const formatQuantity = (value) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const formatMonth = (value) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value);

  const formatPrice = (value) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  const formatTotal = (value) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(value);

  // Fetch available years using React Query
  const { data: yearsData, isLoading } = useQuery({
    queryKey: ["years"],
    queryFn: getYears,
  });

  // Set the default year to the most recent one
  useEffect(() => {
    if (yearsData && yearsData.years.length > 0) {
      const mostRecentYear = Math.max(...yearsData.years); // Get the most recent year
      setSelectedYear(mostRecentYear.toString()); // Set as default selected year
    }
  }, [yearsData]);

  const { data: categoryData, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories", selectedMaterialGroup],
    queryFn: () => getD4Categories(selectedMaterialGroup), // API call to fetch data based on year and category
    enabled: Boolean(selectedYear), // Only run query if year and category are selected
  });

  const {
    data: materialD4Data,
    isLoading: isLoadingMaterialD4Data,
    isError: isErrorMaterialD4Data,
    error: errorMaterialD4Data,
  } = useQuery({
    queryKey: [
      "materials",
      selectedYear,
      selectedCategory,
      selectedMaterialGroup,
    ], // Unique query key for caching
    queryFn: () =>
      getD4Materials(selectedYear, selectedCategory, selectedMaterialGroup), // API call to fetch data based on year and category
    enabled: Boolean(selectedYear) && Boolean(selectedCategory), // Only run query if year and category are selected
  });

  // Map material data to options for react-select
  const materialD4Options = materialD4Data?.map((materialD4) => ({
    value: materialD4.MATNR,
    label: `${materialD4.MATNR} ${materialD4.MAKTX}`,
  }));

  const {
    data: donutUsable,
    isLoading: isLoadingDonutUsable,
    isError: isErrorDonutUsable,
    error: errorDonutUsable,
  } = useQuery({
    queryKey: ["donutUsable", selectedYear], // Unique query key for caching
    queryFn: () => getD4UsableMaterialGroup(selectedYear), // API call to fetch data based on year
    enabled: !!selectedYear, // Only run query if year is selected
  });

  const dataDonutUsable = [
    {
      name: "ใช้ได้ <=3 เดือน",
      priority: "High",
      value: donutUsable?.LESS_SIX,
    },
    {
      name: "ใช้ได้ 3-6 เดือน",
      priority: "Medium",
      value: donutUsable?.SIX_TO_NINE,
    },
    {
      name: "ใช้ได้ >6 เดือน",
      priority: "Low",
      value: donutUsable?.MORE_NINE,
    },
  ];

  const handlePrioritySelect = (priority) => {
    setSelectedMaterialGroup(priority); // Update state with selected priority
  };

  const getTableTitle = (priority) => {
    switch (priority) {
      case "High":
        return "รายการพัสดุที่ ใช้งานได้ <= 3 เดือน";
      case "Medium":
        return "รายการพัสดุที่ ใช้งานได้ 3-6 เดือน";
      case "Low":
        return "รายการพัสดุที่ ใช้งานได้ > 6 เดือน";
      default:
        return "รายการพัสดุ";
    }
  };

  const {
    data: requireMaterialDetail,
    isLoading: isLoadingRequireMaterialDetail,
    isError: isErrorRequireMaterialDetail,
    error: errorRequireMaterialDetail,
  } = useQuery({
    queryKey: ["requireMaterialDetail", selectedYear, selectedMaterialGroup], // Unique query key for caching
    queryFn: () =>
      getD4RequireMaterialDetail(selectedYear, selectedMaterialGroup), // API call to fetch data based on year
    enabled: Boolean(selectedYear) && Boolean(selectedMaterialGroup), // Only run query if year is selected
  });

  const dataTableRequireMaterialDetail =
    requireMaterialDetail?.map((item) => ({
      matNum: Number(item.MATNR),
      matName: item.MAKTX,
      usableMonth: Number(item.TOTAL_USABLE_MONTH),
      matGrade: item.PRIORITY.toLocaleString("th-TH"),
    })) || [];

  const {
    data: simMaterialPlan,
    isLoading: isLoadingSimMaterialPlan,
    isError: isErrorSimMaterialPlan,
    error: errorSimMaterialPlan,
  } = useQuery({
    queryKey: [
      "simMaterialPlan",
      selectedYear,
      selectedHQLeadTime,
      selectedDemandMonth,
      selectedMaterial,
    ], // Unique query key for caching
    queryFn: () =>
      getD4SimMaterialPlan(
        selectedYear,
        selectedHQLeadTime,
        selectedDemandMonth,
        selectedMaterial
      ), // API call to fetch data based on year, HQleadtime, DemandMonth, Material
    enabled:
      Boolean(selectedYear) &&
      Boolean(selectedHQLeadTime) &&
      Boolean(selectedDemandMonth) &&
      Boolean(selectedMaterial), // Only run query if year, HQleadtime, DemandMonth, Material is selected
  });

  const dataTableSimMaterialPlan =
    simMaterialPlan?.map((item) => ({
      region: item.DISTRICT_NAME,
      usage: Number(item.RM),
      stock: Number(item.INVENTORY),
      quantityPR: Number(item.PR_WO_PO),
      contract: Number(item.CONTRACTING),
      availStock: Number(item.TOTAL_USABLE_INVENTORY),
      availMonth: Number(item.TOTAL_USABLE_MONTH),
      quantityAllocate: Number(item.ALLOCATE),
      availMonthAfter: Number(item.TOTAL_USABLE_MONTH_AFTER),
      newMonth: Number(item.TO_PROCURE_MONTH),
      newQuantity: Number(item.TO_PROCURE_UNIT),
      unitHQ: Number(item.TO_PROCURE_HQ),
      priceHQ: Number(item.PRICE_HQ),
      unitDistrict: Number(item.TO_PROCURE_DISTRICT),
      priceDistrict: Number(item.PRICE_DISTRICT),
      mediumPrice: Number(item.MEDIUM_PRICE),
      budget: Number(item.BUDGET),
    })) || [];

  console.log("dataTableSimMaterialPlan:", dataTableSimMaterialPlan);

  const csvTableD42Headers = [
    { label: "กฟฟ.", key: "region" },
    { label: "อัตราการใช้งานต่อเดือน (R/M)", key: "usage" },
    { label: "ยอดคงคล้ง", key: "stock" },
    { label: "PR ที่ยังไม่เป็น PO", key: "quantityPR" },
    { label: "สัญญาค้างรับ", key: "contract" },
    { label: "ยอดคงเหลือ", key: "availStock" },
    { label: "ใช้งานได้ (เดือน)", key: "availMonth" },
    { label: "คาดการณ์จัดสรรจากส่วนกลาง", key: "quantityAllocate" },
    { label: "ใช้งานได้หลังจัดสรร (เดือน)", key: "availMonthAfter" },
    { label: "จัดหาเพิ่ม (เดือน)", key: "newMonth" },
    { label: "จัดหาเพิ่ม (หน่วย)", key: "newQuantity" },
    { label: "จัดหาเพิ่มโดย ฝวห. (หน่วย)", key: "unitHQ" },
    { label: "ราคาที่ ฝวห.", key: "priceHQ" },
    { label: "จัดหาเพิ่มโดย กฟข. (หน่วย)", key: "unitDistrict" },
    { label: "ราคาเฉลี่ยที่ กฟข.", key: "priceDistrict" },
    { label: "ราคาอ้างอิง", key: "mediumPrice" },
    { label: "งบประมาณที่ต้องใช้ ", key: "budget" },
  ];

  // Format the data for CSV
  const formatCSVData = (data) =>
    data.map((item) => ({
      region: item.region,
      usage: formatQuantity(item.usage),
      stock: formatQuantity(item.stock),
      quantityPR: formatQuantity(item.quantityPR),
      contract: formatQuantity(item.contract),
      availStock: formatQuantity(item.availStock),
      availMonth: formatMonth(item.availMonth),
      quantityAllocate: formatQuantity(item.quantityAllocate),
      availMonthAfter: formatMonth(item.availMonthAfter),
      newMonth: formatMonth(item.newMonth),
      newQuantity: formatQuantity(item.newQuantity),
      unitHQ: formatQuantity(item.unitHQ),
      priceHQ: formatPrice(item.priceHQ),
      unitDistrict: formatQuantity(item.unitDistrict),
      priceDistrict: formatPrice(item.priceDistrict),
      mediumPrice: formatPrice(item.mediumPrice),
      budget: formatTotal(item.budget),
    }));

  const csvTableD42Data = formatCSVData(dataTableSimMaterialPlan); // Use your table data as CSV data

  const downloadXLSX = (
    data,
    headers,
    fileName,
    selectedMaterial,
    selectedHQLeadTime,
    selectedDemandMonth,
    dateInfoData
  ) => {
    // Format data with headers
    const formattedData = data.map((item) =>
      headers.reduce((acc, header) => {
        acc[header.label] = item[header.key];
        return acc;
      }, {})
    );

    // Define the number of extra rows
    const extraRowsAbove = Array(7).fill({}); // 7 rows above the table
    const extraRowsBelow = Array(2).fill({}); // 2 rows below the table

    // Combine all rows: extra rows above, header, data, and extra rows below
    const headerRow = headers.reduce((acc, header) => {
      acc[header.label] = header.label; // Add headers as keys
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

    // Add merges for title row and rows below
    const numColumns = headers.length; // Number of columns in the dataset
    worksheet["!merges"] = [
      { s: { r: 1, c: 0 }, e: { r: 1, c: numColumns - 1 } }, // Merge title row
      { s: { r: 3, c: 0 }, e: { r: 3, c: numColumns - 1 } }, // Merge row 4
      { s: { r: 4, c: 0 }, e: { r: 4, c: numColumns - 1 } }, // Merge row 5
      { s: { r: 5, c: 0 }, e: { r: 5, c: numColumns - 1 } }, // Merge row 6
      {
        s: { r: fullData.length - 1, c: 0 },
        e: { r: fullData.length - 1, c: numColumns - 1 },
      }, // Merge info row
    ];

    // Add text to extra rows above
    worksheet["A2"] = { v: "ตารางจำลองแผนจัดซื้อพัสดุเพิ่มเติมระหว่างปี" };
    worksheet["A4"] = { v: `รหัสพัสดุ : ${selectedMaterial || "-"}` };
    worksheet["A5"] = {
      v: `จำนวนเดือนคาดการณ์จัดซื้อโดยส่วนกลาง (ฝวห.) : ${
        selectedHQLeadTime || "-"
      } เดือน`,
    };
    worksheet["A6"] = {
      v: `จำนวนเดือนคาดการณ์ที่ต้องการใช้พัสดุ : ${
        selectedDemandMonth || "-"
      } เดือน`,
    };

    // Style extra rows above
    const styleRowsAbove = [1, 3, 4, 5];
    styleRowsAbove.forEach((rowIndex) => {
      const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: 0 });
      worksheet[cellAddress].s = {
        font: { bold: rowIndex === 1, sz: rowIndex === 1 ? 16 : 12 },
        alignment: {
          horizontal: rowIndex === 1 ? "center" : "left",
          vertical: "center",
        },
      };
    });

    // Add and style rows below
    const infoRowIndex = fullData.length - 1; // Index of the last row
    worksheet[`A${infoRowIndex + 1}`] = {
      v: `ข้อมูล ณ วันที่ ${dateInfoData?.day || "-"} / ${
        dateInfoData?.month || "-"
      } / ${dateInfoData?.year || "-"}`,
    };
    worksheet[`A${infoRowIndex + 1}`].s = {
      font: { sz: 12 },
      alignment: {
        horizontal: "left",
        vertical: "center",
      },
    };

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
        fill: { fgColor: { rgb: "FFFF00" } }, // Yellow background
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
      };
    }

    // Style data cells
    for (
      let R = headerRowIndex + 1;
      R < fullData.length - extraRowsBelow.length;
      ++R
    ) {
      for (let C = 0; C < headers.length; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (!worksheet[cellAddress]) continue;

        const alignRight = C > 1; // Right-align for columns after the first two
        worksheet[cellAddress].s = {
          alignment: {
            horizontal: alignRight ? "right" : "left",
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
      }
    }

    // Dynamically calculate column widths
    const colWidths = headers.map((header) => {
      const columnData = [
        header.label,
        ...formattedData.map((row) => row[header.label]?.toString() || ""),
      ];
      const maxLength = columnData.reduce(
        (max, value) => Math.max(max, value.length),
        0
      );
      return { wch: maxLength + 1 }; // Add a small buffer
    });
    worksheet["!cols"] = colWidths;

    // Append worksheet to workbook and trigger download
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const xlsxData = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([xlsxData], { type: "application/octet-stream" });
    saveAs(blob, `${fileName}.xlsx`);
  };

  const handleSelectHQLeadTime = (index) => {
    console.log("selectedHQLeadTime", index);
    setSelectedHQLeadTime(index);
  };

  const getButtonStyle = (isSelected) => ({
    backgroundColor: isSelected ? "#8e44ad" : "#f0f0f0",
    color: isSelected ? "white" : "black",
    textDecoration: "none", // Remove underline
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "10px 15px",
    cursor: "pointer",
    textAlign: "center",
    display: "inline-block", // Ensure button-like appearance
  });

  const handleSelectDemandMonth = (index) => {
    console.log("selectedDemandMonth", index);
    setSelectedDemandMonth(index);
  };

  const datadate = 1;

  // Fetch summary data for selected year and category using React Query
  const {
    data: dateInfoData,
    isLoading: isLoadingDateInfoData,
    isError: isErrorDateInfoData,
    error: errorDateInfoData,
  } = useQuery({
    queryKey: ["dateInfoData", datadate], // Unique query key for caching
    queryFn: () => getDateInfo(datadate), // API call to fetch data based on datadate
    enabled: !!selectedYear, // Only run query if both year and category_group are selected
  });

  return (
    <div>
      <NavbarComponent />
      <div className="year-dropdown-container">
        <YearDropdown
          onSelectYear={setSelectedYear}
          selectedYear={selectedYear}
        />
      </div>
      <div className="dashboard4-container">
        {/* Summary Section */}
        <div className="summary-container-L1">
          <div className="donut-Chart">
            <D4DonutChartRe
              data={dataDonutUsable}
              title="ภาพรวมรายการพัสดุตาม ใช้งานได้ (เดือน)"
              onPrioritySelect={handlePrioritySelect} // Pass the handler
              height={400}
            />
          </div>
          <div className="table-summary">
            <TableD42
              title={getTableTitle(selectedMaterialGroup)} // Dynamic title
              data={dataTableRequireMaterialDetail}
            />
          </div>
        </div>

        {/* Top Controls Section */}
        <div className="btn-container-L1">
          <div className="dropdown-group D4-dropdown-cat-group">
            <h1 className="text-subtitle">เลือกกลุ่ม และ รายการพัสดุ</h1>
            {isCategoriesLoading ? (
              <p>Loading categories...</p>
            ) : (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">-- เลือกกลุ่มพัสดุ --</option>
                {categoryData?.map((category, index) => (
                  <option key={index} value={category.CATEGORY_GROUP}>
                    {`${category.CATEGORY_GROUP}: ${category.CATEGORY_GROUP_NAME}`}
                  </option>
                ))}
              </select>
            )}
            {isLoadingMaterialD4Data ? (
              <p>Loading materials...</p>
            ) : isErrorMaterialD4Data ? (
              <p>Error fetching materials: {errorMaterialD4Data.message}</p>
            ) : (
              <Select
                options={materialD4Options}
                value={
                  materialD4Options?.find(
                    (option) => option.value === selectedMaterial
                  ) || null
                }
                onChange={(selectedOption) => {
                  const value = selectedOption ? selectedOption.value : ""; // Ensure only value is stored
                  console.log("Selected Material Value:", value); // Log the value
                  setSelectedMaterial(value); // Store only the value in state
                }}
                placeholder="เลือกรายการพัสดุ..."
                isClearable
                isSearchable
                styles={{
                  control: (base) => ({
                    ...base,
                    padding: "5px",
                  }),
                }}
              />
            )}
          </div>

          {/* Lead Time Section */}
          <div className="lead-time">
            <p className="text-subtitle">
              เลือกจำนวนเดือนคาดการณ์จัดซื้อโดยส่วนกลาง (ฝวห.)
            </p>
            <div className="button-group">
              {[
                "1 เดือน",
                "2 เดือน",
                "3 เดือน",
                "4 เดือน",
                "5 เดือน",
                "6 เดือน",
                "7 เดือน",
                "8 เดือน",
                "9 เดือน",
              ].map((label, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectHQLeadTime(index + 1)}
                  style={getButtonStyle(selectedHQLeadTime === index + 1)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Demand Time Section */}
          <div className="demand-time">
            <p className="text-subtitle">
              เลือกจำนวนเดือนคาดการณ์ที่ต้องการใช้พัสดุ
            </p>
            <div className="button-group">
              {[
                "1 เดือน",
                "2 เดือน",
                "3 เดือน",
                "4 เดือน",
                "5 เดือน",
                "6 เดือน",
                "7 เดือน",
                "8 เดือน",
                "9 เดือน",
                "10 เดือน",
                "11 เดือน",
                "12 เดือน",
              ].map((label, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectDemandMonth(index + 1)}
                  style={getButtonStyle(selectedDemandMonth === index + 1)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table and Chart Section */}
        <div className="table-container-L1">
          <div className="table-compare">
            <div className="D4-CSV-container">
              <div className="download-button">
                <button
                  onClick={() =>
                    downloadXLSX(
                      csvTableD42Data, // Data
                      csvTableD42Headers, // Headers
                      `SimMaterialPlan_${selectedYear}`, // File Name
                      selectedMaterial, // Selected Material
                      selectedHQLeadTime, // Selected HQ Lead Time
                      selectedDemandMonth, // Selected Demand Month
                      dateInfoData // Date Info
                    )
                  }
                  style={getButtonStyle(false)} // Apply button style
                >
                  Download XLSX
                </button>
              </div>
            </div>
            <Table4
              title="ตารางจำลองแผนจัดซื้อพัสดุเพิ่มเติมระหว่างปี"
              data={dataTableSimMaterialPlan}
            />
            <p>
              หมายเหตุ: จัดหาเพิ่ม (หน่วย) ที่แสดงในตาราง อาจคลาดเคลื่อนจาก
              จัดหาเพิ่ม (เดือน) คูณ อัตราการใช้งานต่อเดือน (R/M)
              เนื่องจากการปัดเศษทศนิยมของจำนวนเดือน
            </p>
            <D4GroupBarRe
              title="มูลค่าจัดหาพัสดุ (ล้านบาท)"
              data={dataTableSimMaterialPlan}
            />
            <p>
              หมายเหตุ: Savings เกิดจากผลลัพธ์ของ Base case จากการจัดซื้อที่
              กฟข. ทั้งหมด เทียบกับ Target case จากการจัดซื้อตามการจำลอง
            </p>
          </div>
        </div>
        <div>
          <h1 className="data-date">
            ข้อมูล ณ วันที่ {dateInfoData?.day}/{dateInfoData?.month}/
            {dateInfoData?.year}
          </h1>
          <p className="data-date">
            หมายเหตุ: ข้อมูลภายในระบบ Spend Insight เป็นข้อมูลภายในของกฟภ.
            ห้ามเผยแพร่ให้กับผู้ใช้งานภายนอก
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard4;
