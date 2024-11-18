import React, { useState, useEffect } from "react";
import NavbarComponent from "../ComponentsPage/NavbarComponent";
import BackgroundComponent from "../ComponentsPage/BackgroundComponent";
import "../ComponentsStyles/Dashboard4.css"; // Updated to use Dashboard3.css
import YearDropdown from "./YearDropdown";
import Table4 from "./Table4.js";
import D4DonutChartRe from "./D4DonutChartRe.js";
import TableD42 from "./TableD42.js";
import D4GroupBarRe from "./D4GroupBarRe";
import Select from "react-select"; // Import react-select
import { useQuery } from "@tanstack/react-query";
import {
  getYears,
  getD4Categories,
  getD4Materials,
  getD4UsableMaterialGroup,
  getD4RequireMaterialDetail,
  getD4SimMaterialPlan,
  getDateInfo,
} from "../services/api.js"; // Import your API service function

const Dashboard4 = () => {
  const [selectedYear, setSelectedYear] = useState(""); // State to hold the selected year
  const [selectedMaterialGroup, setSelectedMaterialGroup] = useState("High");
  const [selectedCategory, setSelectedCategory] = useState(""); // State to hold the selected category
  const [selectedMaterial, setSelectedMaterial] = useState(""); // State to hold the selected material
  const [selectedHQLeadTime, setSelectedHQLeadTime] = useState(null);
  const [selectedDemandMonth, setSelectedDemandMonth] = useState(null);

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
    queryKey: ["categories"],
    queryFn: getD4Categories,
  });

  const {
    data: materialD4Data,
    isLoading: isLoadingMaterialD4Data,
    isError: isErrorMaterialD4Data,
    error: errorMaterialD4Data,
  } = useQuery({
    queryKey: ["materials", selectedYear, selectedCategory], // Unique query key for caching
    queryFn: () => getD4Materials(selectedYear, selectedCategory), // API call to fetch data based on year and category
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
      value: donutUsable?.LESS_THREE,
    },
    {
      name: "ใช้ได้ 3-6 เดือน",
      priority: "Medium",
      value: donutUsable?.THREE_TO_SIX,
    },
    {
      name: "ใช้ได้ >6 เดือน",
      priority: "Low",
      value: donutUsable?.MORE_SIX,
    },
  ];

  const handlePrioritySelect = (priority) => {
    setSelectedMaterialGroup(priority); // Update state with selected priority
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

  console.log("dataTableSimMaterialPlan:", dataTableSimMaterialPlan);

  const handleSelectHQLeadTime = (index) => {
    console.log("selectedHQLeadTime", index);
    setSelectedHQLeadTime(index);
  };

  const getButtonStyle = (isSelected) => ({
    backgroundColor: isSelected ? "#8e44ad" : "#f0f0f0",
    color: isSelected ? "white" : "black",
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
      <BackgroundComponent />
      <div className="year-dropdown-container">
        <YearDropdown
          onSelectYear={setSelectedYear}
          selectedYear={selectedYear}
        />
      </div>
      <div className="dashboard4-container">
        {/* Summary Section */}
        <div className="summary-container-L1">
          <div className="donutChart">
            <D4DonutChartRe
              data={dataDonutUsable}
              title="ภาพรวมรายการพัสดุตาม ใช้งานได้ (เดือน)"
              onPrioritySelect={handlePrioritySelect} // Pass the handler
              height={400}
            />
          </div>
          {/*           <div className="text-summary">
            <h1 className="text-label">
              จำนวนพัสดุที่ต้องจัดสรรเพิ่มเติม{" "}
              {requireMaterialNum?.MAT_Q_REQ.toLocaleString("th-TH")} รายการ
            </h1>
          </div> */}
          <div className="table-summary">
            <TableD42
              title="รายการพัสดุที่ ใช้งานได้ <= 3 เดือน"
              data={dataTableRequireMaterialDetail}
            />
          </div>
        </div>

        {/* Top Controls Section */}
        <div className="btn-container-L1">
          <div className="dropdown-group dropdown-cat-group">
            <h1 className="text-subtitle">
            เลือกกลุ่ม และ รายการพัสดุ
            </h1>
            {isCategoriesLoading ? (
              <p>Loading categories...</p>
            ) : (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">-- เลือกกลุ่มพัสดุ --</option>
                {categoryData
                  ?.slice() // Create a shallow copy of the array to avoid modifying the original
                  .sort((a, b) => {
                    if (a.CATEGORY_ID === "102") return -1; // Move `102` to the top
                    if (b.CATEGORY_ID === "102") return 1;
                    return a.CATEGORY_ID.localeCompare(b.CATEGORY_ID); // Default alphabetical sort by ID
                  })
                  .map((category, index) => (
                    <option key={index} value={category.CATEGORY_ID}>
                      {`${category.CATEGORY_ID}: ${category.CATEGORY_NAME}`}
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
            <p className="text-subtitle">เลือกจำนวนเดือนคาดการณ์จัดซื้อโดยส่วนกลาง (ฝวห.)</p>
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
            <p className="text-subtitle">เลือกจำนวนเดือนคาดการณ์ที่ต้องการใช้พัสดุ</p>
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
            <Table4
              title="ตารางจำลองแผนจัดซื้อพัสดุเพิ่มเติมระหว่างปี"
              data={dataTableSimMaterialPlan}
            />
            <D4GroupBarRe
              title="คาดการณ์ยอดจัดหาพัสดุ (ล้านบาท)"
              data={dataTableSimMaterialPlan}
            />
          </div>
        </div>
        <div>
          <h1 className="data-date">
            ข้อมูล ณ วันที่ {dateInfoData?.day}/{dateInfoData?.month}/
            {dateInfoData?.year}
          </h1>
          <p className="data-date">
            หมายเหตุ: ข้อมูลภายในระบบ Spend Insight เป็นข้อมูลภายในของกฟภ.
            ห้ามเผยแพร่ให้กับผู้ภายนอก
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard4;
