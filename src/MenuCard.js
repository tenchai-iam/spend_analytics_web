import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import "./ComponentsStyles/MenuCard.css"; // Import CSS styles

const MenuCard = ({ image, title, description, link }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleClick = () => {
    navigate(link); // Navigate to the provided link
  };

  return (
    <div className="menu-card">
      <img src={image} alt={title} className="menu-card-image" />
      <h3 className="menu-card-title">{title}</h3>
      <p className="menu-card-description">{description}</p>
      <button className="menu-card-button" onClick={handleClick}>
        เข้าชม
      </button>
    </div>
  );
};

export default MenuCard;
