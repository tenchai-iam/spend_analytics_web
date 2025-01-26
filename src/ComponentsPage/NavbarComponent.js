import React from "react";
import { Navbar, Nav, NavDropdown, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "bootstrap/dist/css/bootstrap.min.css";
import spendinsight from "../pic/spend_insight_m.png";
import "../ComponentsStyles/NavbarStyles.css"; // Import the custom Navbar CSS file

const logout_url = process.env.REACT_APP_LOGOUT_URL;

function NavbarComponent() {
  return (
    <Navbar
      expand="lg"
      className="gradient-navbar custom-navbar fixed-top"
      variant="dark"
      sticky="top"
    >
      <Container fluid className="d-flex align-items-center">
        {/* Logo */}
        <Navbar.Brand as={Link} to="/home">
          <img
            src={spendinsight} // Replace with the path to your logo
            width="40"
            height="40"
            className="d-inline-block align-top"
            alt="Spend Insight"
          />
        </Navbar.Brand>

        {/* Responsive Toggle */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="me-2" />

        {/* Collapsible Links */}
        <Navbar.Collapse id="basic-navbar-nav" className="d-flex flex-grow-1">
          <Nav className="me-auto">
            {/* Main Links */}
            <Nav.Link as={Link} to="/home">
              หน้าหลัก
            </Nav.Link>

            {/* Dropdown for Admin */}
            <NavDropdown title="สำหรับพนักงานทั่วไป" id="admin-dropdown">
              <NavDropdown.Item
                as={Link}
                to="/dashboard1"
                className="dropdown-item-custom"
              >
                ภาพรวมค่าใช้จ่าย
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                to="/dashboard2"
                className="dropdown-item-custom "
              >
                ภาพรวม Supplier
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                to="/dashboard5"
                className="dropdown-item-custom "
              >
                ติดตามมูลค่า Stage 5
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                to="/dashboard6"
                className="dropdown-item-custom "
              >
                ภาพรวมมูลค่าพัสดุคงคลัง
              </NavDropdown.Item>
            </NavDropdown>

            {/* Dropdown for Planning */}
            <NavDropdown
              title="สำหรับผู้จัดทำแผนจัดหาพัสดุ"
              id="planning-dropdown"
            >
              <NavDropdown.Item
                as={Link}
                to="/dashboard3"
                className="dropdown-item-custom"
              >
                เปรียบเทียบราคาจัดซื้อ
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                to="/dashboard4"
                className="dropdown-item-custom"
              >
                ปรับแผนเพิ่มเติมระหว่างปี
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                to="/dashboard7"
                className="dropdown-item-custom"
              >
                ปรับแผนเพิ่มเติมระหว่างปี (งบ C)
              </NavDropdown.Item>
            </NavDropdown>

            {/* Link for Data Management */}
            <Nav.Link as={Link} to="/upload">
              จัดการข้อมูล
            </Nav.Link>
          </Nav>

          {/* Logout Button */}
          <Button
            className="logout-button ms-auto"
            onClick={() => {
              window.location.href = logout_url;
            }}
          >
            Logout
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
