import React from "react";
import { Navbar, Nav, NavDropdown, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "bootstrap/dist/css/bootstrap.min.css";
import spendinsight from "../pic/spend_insight_m.png";
import workd from "../pic/w-logo.svg";
import "../ComponentsStyles/NavbarStyles.css"; // Import the custom Navbar CSS file

const workd_url = process.env.REACT_APP_WORKD_URL;

function NavbarComponent() {
  // Retrieve user details from sessionStorage
  const firstName = sessionStorage.getItem("first_name");
  const lastName = sessionStorage.getItem("last_name");
  const userLevel = sessionStorage.getItem("user_level"); // "B" can access Dashboard3 & Dashboard4

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

            {/* Dropdown for General Employees */}
            <NavDropdown title="สำหรับพนักงานทั่วไป" id="admin-dropdown">
              <NavDropdown.Item as={Link} to="/dashboard1">
                ภาพรวมค่าใช้จ่าย
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/dashboard2">
                ภาพรวม Supplier
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/dashboard5">
                ติดตามมูลค่า Stage 5
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/dashboard6">
                ภาพรวมมูลค่าพัสดุคงคลัง
              </NavDropdown.Item>
            </NavDropdown>

            {/* Dropdown for Planning - Hidden if user_level is NOT "B" */}
            {userLevel === "B" && (
              <NavDropdown
                title="สำหรับผู้จัดทำแผนจัดหาพัสดุ"
                id="planning-dropdown"
              >
                <NavDropdown.Item as={Link} to="/dashboard3">
                  เปรียบเทียบราคาจัดซื้อ
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/dashboard4">
                  ปรับแผนเพิ่มเติมระหว่างปี
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/dashboard7">
                  ปรับแผนเพิ่มเติมระหว่างปี (งบ C)
                </NavDropdown.Item>
              </NavDropdown>
            )}

            {/* Show Upload NavLink ONLY for user_level "B" */}
            {userLevel === "B" && (
              <Nav.Link as={Link} to="/upload">
                จัดการข้อมูล
              </Nav.Link>
            )}
          </Nav>

          {/* Show First Name & Last Name */}
          <div className="user-info ms-auto me-3">
            <span>{firstName ? `${firstName} ${lastName}` : "ผู้ใช้งาน"}</span>
          </div>

          {/* Logout Button */}
          <Button
            className="logout-button"
            onClick={() => {
              window.location.href = workd_url;
            }}
          >
            &larr; ไปที่ระบบ
            <img
              src={workd}
              height="15"
              className="d-inline-block align-center"
              alt="Spend Insight"
            />
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
