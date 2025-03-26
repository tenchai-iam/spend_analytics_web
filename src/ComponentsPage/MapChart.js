import React, { useState } from "react";
import { Map } from "react-map-gl/maplibre";
import DeckGL from "@deck.gl/react";
import { ColumnLayer } from "@deck.gl/layers";
import "../ComponentsStyles/MapChart.css"; // Ensure CSS is imported
import { GeoJsonLayer } from "@deck.gl/layers";
import { GridLayer } from "@deck.gl/aggregation-layers";

const THAILAND_GEOJSON_URL = "/json/Thailand_S.json";

const thailandLayer = new GeoJsonLayer({
  id: "thailand-boundary",
  data: THAILAND_GEOJSON_URL,
  filled: true,
  stroked: true,
  lineWidthMinPixels: 2,
  getFillColor: [34, 139, 34, 80], // Green with transparency
  getLineColor: [0, 0, 0, 255], // Black borders
});

const INITIAL_VIEW_STATE = {
  longitude: 100.9925,
  latitude: 9.1,
  zoom: 5.0,
  minZoom: 5.0,
  maxZoom: 7.0,
  pitch: 75,
  bearing: -5,
};

// Mapping abbreviations to full Thai location names
const LOCATION_NAMES = {
  A: "กฟน.1",
  B: "กฟน.2",
  C: "กฟน.3",
  D: "กฟฉ.1",
  E: "กฟฉ.2",
  F: "กฟฉ.3",
  G: "กฟก.1",
  H: "กฟก.2",
  I: "กฟก.3",
  J: "กฟต.1",
  K: "กฟต.2",
  L: "กฟต.3",
  U: "ตัวอย่าง", // Example text in Thai
  Z: "ส่วนกลาง",
};

const CATEGORY_NAMES = {
  TOTAL_SPEND_MAT: "มูลค่าพัสดุสะสม",
  TOTAL_PO_MAT: "จำนวน PO สั่งซื้อพัสดุสะสม",
};

const ELEVATION_SCALE_PO = 30;
const ELEVATION_SCALE_SPEND = 30;

const quantityFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const priceFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
});

function getTooltip({ object }) {
  if (!object) return null;

  const locationName = LOCATION_NAMES[object.location] || object.location;
  const categoryName = CATEGORY_NAMES[object.type];

  // Apply different formatting based on the category name
  let formattedValue;
  if (categoryName === "จำนวน PO สั่งซื้อพัสดุสะสม") {
    formattedValue = quantityFormatter.format(object.value); // Use quantity format
  } else {
    formattedValue = priceFormatter.format(object.value); // Use price format
  }

  return `Location: ${locationName}\n${categoryName}: ${formattedValue}`;
}

// Legend Component
const Legend = () => (
  <div className="legend">
    <div className="legend-item">
      <span className="color-box po-color"></span> จำนวน PO สั่งซื้อพัสดุสะสม
    </div>
    <div className="legend-item">
      <span className="color-box spend-color"></span> มูลค่าจัดซื้อพัสดุสะสม
      (ล้านบาท)
    </div>
  </div>
);

// Group data by location for easy access
const groupDataByLocation = (data) =>
  data.reduce((acc, item) => {
    if (!acc[item.location]) acc[item.location] = [];
    acc[item.location].push(item);
    return acc;
  }, {});

// Adjust positions to prevent column overlap
const getOffsetPosition = (position, type) => {
  const offset = type === "TOTAL_PO_MAT" ? -0.15 : 0.15;
  return [position[0] + offset, position[1]]; // Offset along longitude (x-axis)
};

const MapChart = ({ data, mapStyle }) => {
  const groupedData = groupDataByLocation(data);

  const columnLayer = new ColumnLayer({
    id: "3d-bar-chart",
    data,
    diskResolution: 2,
    radius: 10000,
    getPosition: (d) => getOffsetPosition(d.position, d.type),
    getFillColor: (d) =>
      d.type === "TOTAL_PO_MAT"
        ? [253, 176, 3] // Light Pink for PO
        : [147, 43, 222], // Light Blue for Spend
    getElevation: (d) =>
      d.value *
      (d.type === "TOTAL_SPEND_MAT"
        ? ELEVATION_SCALE_SPEND
        : ELEVATION_SCALE_PO),
    pickable: true,
    extruded: true,
    material: null,
    // material: {
    //   ambient: 0.64,
    //   diffuse: 0.6,
    //   shininess: 32,
    //   specularColor: [51, 51, 51],
    // },
  });

  return (
    <div className="map-container">
      <Legend /> {/* Include Legend at the top */}
      <div className="map-and-table">
        <div className="map-section">
          <DeckGL
            layers={[thailandLayer, columnLayer]}
            initialViewState={INITIAL_VIEW_STATE}
            controller={{ dragRotate: false }}
            getTooltip={getTooltip}
            style={{ height: "100%", width: "100%" }}
            // webgl2={true}
          >
            <Map
              reuseMaps
              crossOrigin="anonymous"
              mapStyle={{
                version: 8,
                sources: {
                  localTiles: {
                    type: "raster",
                    tiles: ["/tiles/{z}/{x}/{y}.png"],
                    tileSize: 256,
                  },
                },
                layers: [
                  {
                    id: "local-raster-layer",
                    type: "raster",
                    source: "localTiles",
                    minzoom: 0,
                    maxzoom: 22,
                  },
                ],
              }}
              style={{ height: "100%", width: "100%" }}
            />
            console.log("Loading tile: ", z, x, y);
          </DeckGL>
        </div>
        <div className="table-section">
          <DataTable data={data} />
        </div>
      </div>
    </div>
  );
};

const DataTable = ({ data }) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const groupedData = groupDataByLocation(data);

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = Object.entries(groupedData).sort((a, b) => {
    if (sortConfig.key === "location") {
      const aLocationName = LOCATION_NAMES[a[0]] || a[0];
      const bLocationName = LOCATION_NAMES[b[0]] || b[0];
      return sortConfig.direction === "ascending"
        ? aLocationName.localeCompare(bLocationName)
        : bLocationName.localeCompare(aLocationName);
    } else {
      const aValue = a[1].find((d) => d.type === sortConfig.key)?.value || 0;
      const bValue = b[1].find((d) => d.type === sortConfig.key)?.value || 0;
      return sortConfig.direction === "ascending"
        ? aValue - bValue
        : bValue - aValue;
    }
  });

  const renderSortArrow = (columnKey) => {
    if (sortConfig.key === columnKey) {
      return sortConfig.direction === "ascending" ? "▲" : "▼";
    }
    return "";
  };

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>หน่วยงานจัดซื้อ</th>
          <th onClick={() => handleSort("TOTAL_PO_MAT")}>
            จำนวน PO สั่งซื้อพัสดุสะสม {renderSortArrow("TOTAL_PO_MAT")}
          </th>
          <th onClick={() => handleSort("TOTAL_SPEND_MAT")}>
            มูลค่าจัดซื้อพัสดุสะสม (ล้านบาท){" "}
            {renderSortArrow("TOTAL_SPEND_MAT")}
          </th>
        </tr>
      </thead>
      <tbody>
        {sortedData.map(([location, items]) => {
          const totalPO =
            items.find((d) => d.type === "TOTAL_PO_MAT")?.value || 0;
          const totalSpend =
            items.find((d) => d.type === "TOTAL_SPEND_MAT")?.value || 0;
          return (
            <tr key={location}>
              <td>{LOCATION_NAMES[location]}</td>
              <td>{quantityFormatter.format(totalPO)}</td>
              <td>{priceFormatter.format(totalSpend)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default MapChart;
