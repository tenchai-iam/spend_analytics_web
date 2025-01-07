import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import "../ComponentsStyles/MenuCard.css"; // Import CSS styles

const MenuCard = ({ image, buttonTitle, link }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleClick = () => {
    navigate(link); // Navigate to the provided link
  };

  return (
    <div className="menu-card">
      <img src={image} className="menu-card-image" />
      <button className="menu-card-button" onClick={handleClick}>
        {buttonTitle}
      </button>
    </div>
  );
};

export default MenuCard;
