// File: MapChart.js
import React from "react";
import { Map } from "react-map-gl/maplibre";
import DeckGL from "@deck.gl/react";
import { AmbientLight, PointLight, LightingEffect } from "@deck.gl/core";
import { ColumnLayer, TextLayer } from "@deck.gl/layers";

// Initial view state centered over Thailand
const INITIAL_VIEW_STATE = {
  longitude: 100.9925,
  latitude: 11.1,
  zoom: 5.2,
  minZoom: 5.2,
  maxZoom: 7.2,
  pitch: 45,
  bearing: 0,
};

// Sample data for demonstration purposes
const DATA = [
  { position: [100.5018, 13.7563], value: 100 }, // Bangkok
  { position: [98.9933, 18.7877], value: 80 }, // Chiang Mai
  { position: [100.9925, 15.87], value: 50 }, // Central Thailand
  { position: [99.7207, 12.5684], value: 40 }, // Prachuap Khiri Khan
  { position: [102.135, 16.4343], value: 70 }, // Khon Kaen
  { position: [101.0757, 14.9799], value: 60 }, // Nakhon Ratchasima
  { position: [100.2741, 16.8248], value: 55 }, // Phitsanulok
  { position: [100.3697, 7.0083], value: 45 }, // Hat Yai
  { position: [103.204, 14.8857], value: 35 }, // Ubon Ratchathani
  { position: [100.6063, 13.762], value: 90 }, // Nonthaburi
  { position: [104.1472, 17.4138], value: 65 }, // Mukdahan
];

// Lighting setup for 3D effects
const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0,
});
const pointLight = new PointLight({
  color: [255, 255, 255],
  intensity: 1.0,
  position: [100.5018, 13.7563, 8000],
});
const lightingEffect = new LightingEffect({ ambientLight, pointLight });

function getTooltip({ object }) {
  return (
    object &&
    `Location: [${object.position[0].toFixed(4)}, ${object.position[1].toFixed(
      4
    )}]\nValue: ${object.value}`
  );
}

const MapChart = ({
  data = DATA,
  mapStyle = "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json",
}) => {
  // ColumnLayer for 3D bars
  const columnLayer = new ColumnLayer({
    id: "3d-bar-chart",
    data,
    diskResolution: 12,
    radius: 15000, // Adjusted radius to prevent overlap
    elevationScale: 100,
    getPosition: (d) => d.position,
    getFillColor: (d) => {
      const value = d.value;
      if (value > 80) return [178, 24, 43];
      if (value > 60) return [239, 138, 98];
      if (value > 40) return [253, 219, 199];
      return [209, 229, 240];
    },
    getElevation: (d) => d.value,
    pickable: true,
    extruded: true,
    material: {
      ambient: 0.64,
      diffuse: 0.6,
      shininess: 32,
      specularColor: [51, 51, 51],
    },
  });

  // TextLayer for displaying values on top of each bar
  const textLayer = new TextLayer({
    id: "text-layer",
    data,
    pickable: false,
    getPosition: (d) => [d.position[0], d.position[1], d.value * 100], // Position text at the top of each bar
    getText: (d) => `${d.value}`, // Display the value as text
    getSize: 16, // Font size
    getColor: [255, 255, 255], // White text color
    getTextAnchor: "middle", // Center the text horizontally
    getAlignmentBaseline: "bottom", // Align text to the bottom to ensure it's on top of the bar
  });

  return (
    <DeckGL
      layers={[columnLayer, textLayer]} // Include both ColumnLayer and TextLayer
      effects={[lightingEffect]}
      initialViewState={INITIAL_VIEW_STATE}
      controller={{ dragRotate: false }}
      getTooltip={getTooltip}
      style={{ height: "100%", width: "100%" }}
    >
      <Map
        reuseMaps
        mapStyle={mapStyle}
        style={{ height: "100%", width: "100%" }}
      />
    </DeckGL>
  );
};

export default MapChart;
