import React from "react";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "bootstrap/dist/css/bootstrap.min.css";
import spendinsight from "../pic/spend_insight_m.png";
import "../ComponentsStyles/NavbarStyles.css"; // Import the custom Navbar CSS file

function NavbarComponent() {
  return (
    <Navbar
      expand="lg"
      className="gradient-navbar custom-navbar fixed-top"
      variant="dark"
      sticky="top"
    >
      <Container fluid>
        {/* Logo */}
        <Navbar.Brand as={Link} to="/home">
          {" "}
          {/* Use Link instead of href */}
          {/*           <img
            src={pealogo} // Replace with the path to your logo
            width="70"
            height="35"
            className="d-inline-block align-top"
            alt="PEA Logo"
          />{" "} */}
          <img
            src={spendinsight} // Replace with the path to your logo
            width="40"
            height="40"
            className="d-inline-block align-top"
            alt="Spend Insight"
          />{" "}
        </Navbar.Brand>

        {/* Responsive Toggle */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Collapsible Links */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            {/* Main Links */}
            <Nav.Link as={Link} to="/home">
              หน้าหลัก
            </Nav.Link>{" "}
            {/* Use Link with to */}
            {/* Dropdown for Admin */}
            <NavDropdown title="สำหรับพนักงานทั่วไป" id="admin-dropdown">
              <NavDropdown.Item as={Link} to="/dashboard1">
                ภาพรวมค่าใช้จ่าย
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/dashboard2">
                ภาพรวม Supplier
              </NavDropdown.Item>
            </NavDropdown>
            {/* Dropdown for Planning */}
            <NavDropdown title="สำหรับผู้จัดทำแผนจัดหาพัสดุ" id="planning-dropdown">
              <NavDropdown.Item as={Link} to="/dashboard3">
                เปรียบเทียบราคาจัดซื้อ
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/dashboard4">
                ปรับแผนเพิ่มเติมระหว่างปี
              </NavDropdown.Item>
            </NavDropdown>
            {/* Link for Data Management */}
            <Nav.Link as={Link} to="/upload">
              การจัดการข้อมูล
            </Nav.Link>{" "}
            {/* Use Link with to */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
