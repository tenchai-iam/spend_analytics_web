import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import NavbarComponent from "./NavbarComponent.js";

import YearDropdown from "./YearDropdown.js";
import Table4 from "./Table4.js";
import D4DonutChartRe from "./D4DonutChartRe.js";
import TableD4Priority from "./TableD4Priority.js";
import D4GroupBarRe from "./D4GroupBarRe.js";
import Select from "react-select"; // Import react-select

import { getYears, getDateInfo } from "../services/api.js"; // Import your API service function
import {
  getD4RM,
  getD4Categories,
  getD4Materials,
  getD4UsableMaterialGroup,
  getD4RequireMaterialDetail,
  getD4SimMaterialPlan,
} from "../services/api_D4.js";
import { downloadXLSX, formatters } from "../utils/downloadXLSX";

import "../ComponentsStyles/Dashboard4.css"; // Updated to use Dashboard3.css

const Dashboard4A = () => {
  const [selectedYear, setSelectedYear] = useState(""); // State to hold the selected year
  const [selectedMaterialGroup, setSelectedMaterialGroup] = useState("High");
  const [selectedCategory, setSelectedCategory] = useState(""); // State to hold the selected category
  const [selectedMaterial, setSelectedMaterial] = useState(""); // State to hold the selected material
  const [selectedHQLeadTime, setSelectedHQLeadTime] = useState(null);
  const [selectedDemandMonth, setSelectedDemandMonth] = useState(null);

  const formatQuantity = formatters.quantity;
  const formatPrice = formatters.price;
  const formatMonth = (value) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
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

  // Fetch available years using React Query
  const { data: rmData, isLoadingRMData } = useQuery({
    queryKey: ["rm"],
    queryFn: getD4RM,
  });

  // Prepare raw RM data for download
  const rawRMData = rmData
    ?.filter((item) => item.MATNR && item.RM) // Ensure valid entries
    .map((item) => ({
      MATNR: item.MATNR, // Material Number
      RM: item.RM === "-" ? 0 : Number(item.RM), // Convert to number
    })) || [];

  const rmHeaders = [
    { label: "MATNR", key: "MATNR" },
    { label: "อัตราการใช้งานต่อเดือน (R/M)", key: "RM" },
  ];

  const downloadXLSX_RM = (data, headers, fileName, dateInfoData) => {
    downloadXLSX({
      data: data, // Use raw unformatted data
      headers,
      fileName,
      title: `ตาราง RM ปี ${selectedYear}`,
      filters: [`รหัสพัสดุ : ${selectedMaterial || "-"}`],
      dateInfo: dateInfoData,
      preserveRawNumbers: true,
      columnTypes: {
        0: "text",     // MATNR
        1: "number",   // RM
      },
    });
  };

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

  const simMaterialPlanHeaders = [
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

  // Raw data is already properly structured in dataTableSimMaterialPlan

  const downloadXLSX_SimMaterialPlan = (
    data,
    headers,
    fileName,
    selectedMaterial,
    selectedHQLeadTime,
    selectedDemandMonth,
    dateInfoData
  ) => {
    downloadXLSX({
      data: data, // Use raw unformatted data
      headers,
      fileName,
      title: "ตารางจำลองแผนจัดซื้อพัสดุเพิ่มเติมระหว่างปี",
      filters: [
        `รหัสพัสดุ : ${selectedMaterial || "-"}`,
        `จำนวนเดือนคาดการณ์จัดซื้อโดยส่วนกลาง (ฝวห.) : ${selectedHQLeadTime || "-"} เดือน`,
        `จำนวนเดือนคาดการณ์ที่ต้องการใช้พัสดุ : ${selectedDemandMonth || "-"} เดือน`
      ],
      dateInfo: dateInfoData,
      preserveRawNumbers: true,
      columnTypes: {
        0: "text",     // กฟฟ.
        1: "number",   // อัตราการใช้งานต่อเดือน
        2: "number",   // ยอดคงคล้ง
        3: "number",   // PR ที่ยังไม่เป็น PO
        4: "number",   // สัญญาค้างรับ
        5: "number",   // ยอดคงเหลือ
        6: "number",   // ใช้งานได้ (เดือน)
        7: "number",   // คาดการณ์จัดสรรจากส่วนกลาง
        8: "number",   // ใช้งานได้หลังจัดสรร (เดือน)
        9: "number",   // จัดหาเพิ่ม (เดือน)
        10: "number",  // จัดหาเพิ่ม (หน่วย)
        11: "number",  // จัดหาเพิ่มโดย ฝวห. (หน่วย)
        12: "currency", // ราคาที่ ฝวห.
        13: "number",  // จัดหาเพิ่มโดย กฟข. (หน่วย)
        14: "currency", // ราคาเฉลี่ยที่ กฟข.
        15: "currency", // ราคาอ้างอิง
        16: "currency", // งบประมาณที่ต้องใช้
      },
    });
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
      <div className="text-dropdown-container">
        <h1 className="header-title">ปรับแผนเพิ่มเติมระหว่างปี</h1>
        {/* <div className="year-dropdown-container">
        <YearDropdown
          onSelectYear={setSelectedYear}
          selectedYear={selectedYear}
        />
      </div> */}
      </div>
      <div className="rm-container">
        <div>
          <p className="top-text">R/M ของแต่ละพัสดุเฉลี่ย 24 เดือน</p>
        </div>
        <div className="download-button">
          <button
            onClick={() =>
              downloadXLSX_RM(
                rawRMData, // Data
                rmHeaders, // Headers
                `RMinput_${selectedYear}`, // File Name
                dateInfoData // Date Info
              )
            }
            style={getButtonStyle(false)} // Apply button style
          >
            Download XLSX
          </button>
        </div>
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
            <TableD4Priority
              title={getTableTitle(selectedMaterialGroup)} // Dynamic title
              data={dataTableRequireMaterialDetail}
            />
          </div>
        </div>

        {/* Top Controls Section */}
        <div className="btn-container-L1">
          <div className="dropdown-group D4-dropdown-cat-group">
            <h1 className="text-subtitle">เลือกกลุ่มและรายการพัสดุ</h1>
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
            <div className="D4-dropdown-container">
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
          </div>

          {/* Lead Time Section */}
          <div className="lead-time">
            <p className="text-subtitle">
              เลือกจำนวนเดือนคาดการณ์จัดซื้อโดยส่วนกลาง (ฝวห.)
            </p>
            <div className="button-group-lead">
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
            <div className="button-group-demand">
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
            <div className="download-container">
              <div className="download-button">
                <button
                  onClick={() =>
                    downloadXLSX_SimMaterialPlan(
                      dataTableSimMaterialPlan, // Data
                      simMaterialPlanHeaders, // Headers
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
            <div className="remark-container">
              <p>
                ⓘ หมายเหตุ: จัดหาเพิ่ม (หน่วย) ที่แสดงในตาราง อาจคลาดเคลื่อนจาก
                จัดหาเพิ่ม (เดือน) คูณ อัตราการใช้งานต่อเดือน (R/M)
                เนื่องจากการปัดเศษทศนิยมของจำนวนเดือน
              </p>
            </div>
            <D4GroupBarRe
              title="มูลค่าจัดหาพัสดุ (ล้านบาท)"
              data={dataTableSimMaterialPlan}
            />
            <div className="remark-container">
              <p>ⓘ หมายเหตุ:</p>
              <p>
                1. Savings เกิดจากผลลัพธ์ของ Base Case จากการจัดซื้อที่ กฟข.
                ทั้งหมด เทียบกับ Target Case จากการจัดซื้อตามการจำลอง
              </p>
              <p>
                2. Base Case
                คือการจัดซื้อแบบเดิมโดยไม่ผ่านการวิเคราะห์ข้อมูลจากระบบ Spend
                Insight
              </p>
              <p>
                3. Target Case คือการจัดซื้อโดยผ่านการวิเคราะห์ข้อมูลจากระบบ
                Spend Insight”
              </p>
            </div>
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

export default Dashboard4A;
