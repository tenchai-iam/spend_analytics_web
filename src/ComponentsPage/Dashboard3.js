import React, { useState, useEffect } from "react";
import "../ComponentsStyles/Dashboard3.css"; // Updated to use Dashboard3.css
import BackgroundComponent from "../ComponentsPage/BackgroundComponent";
import YearDropdown from "./YearDropdown";
import NavbarComponent from "../ComponentsPage/NavbarComponent";
import D3BarGraphReV from "./D3BarGraphReV";
import TableD3Price from "./TableD3Price";
import Select from "react-select"; // Import react-select
import { useQuery } from "@tanstack/react-query";
import {
  getYears,
  getCategories,
  getMaterials,
  getD3Districts,
  getD3CategoryPriceTable,
  getD3MaterialPriceGroupDistrict,
  getD3MaterialPriceByDistrict,
  getD3MaterialPriceGroupEKGRP,
  getD3MaterialPriceByEKGRP,
  getDateInfo,
} from "../services/api.js"; // Import your API service function

const Dashboard3 = () => {
  const [selectedYear, setSelectedYear] = useState(""); // State to hold the selected year
  const [selectedCategory, setSelectedCategory] = useState(""); // State to hold the selected category
  const [selectedMaterial, setSelectedMaterial] = useState(""); // State to hold the selected material
  const [selectedDistrict, setSelectedDistrict] = useState(""); // State to hold the selected material
  const [showFirstChart, setShowFirstChart] = useState(true); // State to toggle between the charts

  const priceFormatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Fetch available years using React Query
  const { data: yearsData, isLoading: isYearsLoading } = useQuery({
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
    queryFn: getCategories,
  });

  const {
    data: materialD3Data,
    isLoading: isLoadingMaterialD3Data,
    isError: isErrorMaterialD3Data,
    error: errorMaterialD3Data,
  } = useQuery({
    queryKey: ["materials", selectedYear, selectedCategory], // Unique query key for caching
    queryFn: () => getMaterials(selectedYear, selectedCategory), // API call to fetch data based on year
    enabled: Boolean(selectedYear) && Boolean(selectedCategory) !== null, // Only run query if year and category are selected
  });

  // Map material data to options for react-select
  const materialD3Options = materialD3Data?.map((materialD3) => ({
    value: materialD3.MATNR,
    label: `${materialD3.MATNR} ${materialD3.MAKTX}`,
  }));

  const {
    data: districtData,
    isLoading: isLoadingDistrictData,
    isError: isErrorDistrictData,
    error: errorDistrictData,
  } = useQuery({
    queryKey: ["districts", selectedYear, selectedMaterial], // Unique query key for caching
    queryFn: () => getD3Districts(selectedYear, selectedMaterial), // API call to fetch data based on year
    enabled: Boolean(selectedYear) && Boolean(selectedMaterial), // Only run query if year is selected
  });

  const {
    data: categoryPriceTable,
    isLoading: isLoadingCategoryPriceTable,
    isError: isErrorCategoryPriceTable,
    error: errorCategoryPriceTable,
  } = useQuery({
    queryKey: ["categoryPriceTable", selectedYear, selectedCategory], // Unique query key for caching
    queryFn: () => getD3CategoryPriceTable(selectedYear, selectedCategory), // API call to fetch data based on year and category are selected
    enabled: Boolean(selectedYear) && Boolean(selectedCategory), // Only run query if year and category are selected
  });

  const dataTablePrice =
    categoryPriceTable?.data?.map((item) => ({
      matNR: item.MATNR,
      matName: item.MAKTX,
      priceHQ: Number(item.PRICE_HQ),
      priceDistrict: Number(item.PRICE_REGION),
      priceDiff: Number(item.PRICE_DIFF) - 1,
    })) || [];

  const {
    data: materialPriceGroupDistrict,
    isLoading: isLoadingMaterialPriceGroupDistrict,
    isError: isErrorMaterialPriceGroupDistrict,
    error: errorMaterialPriceGroupDistrict,
  } = useQuery({
    queryKey: ["materialPriceGroupDistrict", selectedYear, selectedMaterial], // Unique query key for caching
    queryFn: () =>
      getD3MaterialPriceGroupDistrict(selectedYear, selectedMaterial), // API call to fetch data based on year and material are selected
    enabled: Boolean(selectedYear) && Boolean(selectedMaterial), // Only run query if year and material are selected
  });

  const {
    data: materialPriceByDistrict,
    isLoading: isLoadingMaterialPriceByDistrict,
    isError: isErrorMaterialPriceByDistrict,
    error: errorMaterialPriceByDistrict,
  } = useQuery({
    queryKey: ["materialPriceByDistrict", selectedYear, selectedMaterial], // Unique query key for caching
    queryFn: () => getD3MaterialPriceByDistrict(selectedYear, selectedMaterial), // API call to fetch data based on year and material are selected
    enabled: Boolean(selectedYear) && Boolean(selectedMaterial), // Only run query if year and material are selected
  });

  const dataMaterialPriceByDistrict =
    materialPriceByDistrict?.map((district) => ({
      name: district?.DISTRICT_NAME,
      maxPrice: district?.PRICE_MAX_REGION,
      averagePrice: district?.PRICE_AVERAGE_REGION,
      minPrice: district?.PRICE_MIN_REGION,
    })) || [];

  const {
    data: materialPriceGroupEKGRP,
    isLoading: isLoadingMaterialPriceGroupEKGRP,
    isError: isErrorMaterialPriceGroupEKGRP,
    error: errorMaterialPriceGroupEKGRP,
  } = useQuery({
    queryKey: [
      "materialPriceGroupEKGRP",
      selectedYear,
      selectedMaterial,
      setSelectedDistrict,
    ], // Unique query key for caching
    queryFn: () =>
      getD3MaterialPriceGroupEKGRP(
        selectedYear,
        selectedMaterial,
        selectedDistrict
      ), // API call to fetch data based on year, material, district are selected
    enabled:
      Boolean(selectedYear) &&
      Boolean(selectedMaterial) &&
      Boolean(selectedDistrict), // Only run query if year, material, district are selected
  });

  const {
    data: materialPriceByEKGRP,
    isLoading: isLoadingMaterialPriceByEKGRP,
    isError: isErrorMaterialPriceByEKGRP,
    error: errorMaterialPriceByEKGRP,
  } = useQuery({
    queryKey: [
      "materialPriceByEKGRP",
      selectedYear,
      selectedMaterial,
      selectedDistrict,
    ], // Unique query key for caching
    queryFn: () =>
      getD3MaterialPriceByEKGRP(
        selectedYear,
        selectedMaterial,
        selectedDistrict
      ), // API call to fetch data based on year and material are selected
    enabled:
      Boolean(selectedYear) &&
      Boolean(selectedMaterial) &&
      Boolean(selectedDistrict), // Only run query if year and material are selected
  });

  const dataMaterialPriceByEKGRP =
    materialPriceByEKGRP?.map((ekgrp) => ({
      name: ekgrp?.EKGRP_NAME,
      maxPrice: ekgrp?.PRICE_MAX_EKGRP,
      averagePrice: ekgrp?.PRICE_AVERAGE_EKGRP,
      minPrice: ekgrp?.PRICE_MIN_EKGRP,
    })) || [];

  const toggleChart = () => {
    setShowFirstChart(!showFirstChart); // Toggle between true and false
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
      <div className="dashboard3-container">
        {/* Left Container */}
        <div className="top-container">
          <h1 className="text-title">
            เปรียบเทียบราคาจัดซื้อพัสดุส่วนกลาง vs. กฟข.
          </h1>
          <div className="dropdown-cat-group">
            {isCategoriesLoading ? (
              <p>Loading categories...</p>
            ) : (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">-- เลือกประเภทพัสดุ --</option>
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
          </div>
          <TableD3Price
            title={`เปรียบเทียบราคาจัดซื้อส่วนกลาง vs. กฟข. ในปี ${selectedYear}`}
            data={dataTablePrice}
          />
        </div>
        <div className="bottom-container">
          <h1 className="text-title">{`เปรียบเทียบราคาจัดซื้อพัสดุตามหน่วยงานจัดซื้อ ในปี ${selectedYear}`}
          </h1>
          <div className="dropdown-cat-group">
            {isLoadingMaterialD3Data ? (
              <p>Loading materials...</p>
            ) : isErrorMaterialD3Data ? (
              <p>Error fetching materials: {errorMaterialD3Data.message}</p>
            ) : (
              <Select
                options={materialD3Options}
                value={materialD3Options?.find(
                  (option) => option.value === selectedMaterial
                )}
                onChange={(selectedOption) => {
                  console.log("Selected MATNR:", selectedOption?.value);
                  setSelectedMaterial(selectedOption?.value);
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

          {/* Toggle Button */}
          <button className="chart-button" onClick={toggleChart}>
            {showFirstChart ? "แยกตาม กฟข. หน้างาน" : "แยกตาม กฟข. 12 เขค"}
          </button>

          {/* Chart Container */}

          {showFirstChart ? (
            <div>
              <div className="price-summary">
                <div>
                  <p className="text-subtitle">
                    ราคาต่ำสุด:{" "}
                    {priceFormatter.format(materialPriceGroupDistrict?.PRICE_LOWEST)}{" "}
                    บาท
                  </p>
                </div>
                <div>
                  <p className="text-subtitle">
                    ราคาเฉลี่ย:{" "}
                    {priceFormatter.format(materialPriceGroupDistrict?.PRICE_AVERAGE)}{" "}
                    บาท
                  </p>
                </div>
                <div>
                  <p className="text-subtitle">
                    ราคาสูงสุด:{" "}
                    {priceFormatter.format(materialPriceGroupDistrict?.PRICE_HIGHEST)}{" "}
                    บาท
                  </p>
                </div>
              </div>
              <div>
                <p className="text-subtitle">
                  หน่วย: บาท ต่อ {materialPriceGroupDistrict?.UOM}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div className="dropdown-cat-group">
                {isLoadingDistrictData ? (
                  <p>Loading districts...</p>
                ) : (
                  <select
                    value={selectedDistrict}
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      setSelectedDistrict(selectedValue);
                      console.log("Selected District:", selectedValue);
                    }}
                  >
                    <option value="">-- เลือกเขต --</option>
                    {districtData.districts.map((district, index) => (
                      <option key={index} value={district.DISTRICT}>
                        {`${district.DISTRICT}: ${district.DISTRICT_NAME}`}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="price-summary">
                <div>
                  <p className="text-subtitle">
                    ราคาต่ำสุด:{" "}
                    {priceFormatter.format(materialPriceGroupEKGRP?.PRICE_LOWEST)}{" "}
                    บาท
                  </p>
                </div>
                <div>
                  <p className="text-subtitle">
                    ราคาเฉลี่ย:{" "}
                    {priceFormatter.format(materialPriceGroupEKGRP?.PRICE_AVERAGE)}{" "}
                    บาท
                  </p>
                </div>
                <div>
                  <p className="text-subtitle">
                    ราคาสูงสุด:{" "}
                    {priceFormatter.format(materialPriceGroupEKGRP?.PRICE_HIGHEST)}{" "}
                    บาท
                  </p>
                </div>
              </div>
              <div>
                <p className="text-subtitle">
                  หน่วย: บาท ต่อ {materialPriceGroupEKGRP?.UOM}
                </p>
              </div>
            </div>
          )}
          <div>
            {showFirstChart ? (
              <D3BarGraphReV
                data={dataMaterialPriceByDistrict}
                xAxisKey="name"
                barKey="averagePrice"
                title="ข้อมูลราคาเฉลี่ยตามหน่วยงานจัดซื้อ"
              />
            ) : (
              <D3BarGraphReV
                data={dataMaterialPriceByEKGRP}
                xAxisKey="name"
                barKey="averagePrice"
                title="ข้อมูลราคาเฉลี่ยตามหน่วยงานจัดซื้อ"
              />
            )}
            <h1 className="text-subtitle">
              หมายเหตุ: หากไม่มีการจัดซื้อเกิดขึ้น ณ หน่วยงานจัดซื้อนั้นๆในปีที่เลือกแสดง
              จะไม่มีการแสดงผลราคาเฉลี่ย
            </h1>
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

export default Dashboard3;
