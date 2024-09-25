import React from "react";
import "./ComponentsStyles/BackgroundStyles.css"; // Import the custom CSS for background effects

function BackgroundComponent({ children }) {
  // Accept children components as props
  return (
    <div className="responsive-background">
      {children} {/* Render children components such as Navbar and content */}
    </div>
  );
}

export default BackgroundComponent;
