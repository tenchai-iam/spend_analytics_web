import React from "react";

const ToggleButton = ({ toggleView, isCardView }) => {
  return (
    <button onClick={toggleView} className="toggle-button">
      {isCardView ? "Graph View" : "Card View"}
    </button>
  );
};

export default ToggleButton;
