import React, { useState, useRef } from "react";
import NavbarComponent from "../ComponentsPage/NavbarComponent";
import axios from "axios";
import File from "../pic/File.svg";
import UploadButton from "../pic/Upload.svg";
import "../ComponentsStyles/upload.css";

const API_URL = process.env.REACT_APP_API_URL;

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const formRefs = useRef({});

  // Configuration for each upload section
  const uploadSections = [
    {
      title: "ข้อมูลยอดใช้งานต่อเดือน (R/M)",
      endpoint: `${API_URL}/upload_and_update_rm_input`,
    },
    {
      title: "ข้อมูลยอดจ่ายเข้างานของพัสดุกรณีที่แตกต่างจากปกติ",
      endpoint: `${API_URL}/upload_and_update_rm_special_input`,
    },
    {
      title: "ข้อมูลราคากลางที่ใช้ในการประมาณการงบประมาณ (Reference price)",
      endpoint: `${API_URL}/upload_and_update_medium_price`,
    },
    {
      title: "ข้อมูลหน่วยนับ packaging",
      endpoint: `${API_URL}/upload_and_update_package`,
    },
    {
      title: "ข้อมูลการจัดกลุ่มประเภทพัสดุ",
      endpoint: `${API_URL}/upload_and_update_category_group`,
    },
    {
      title: "ข้อมูลพัสดุสายไฟที่มีการจ้างรีดที่ส่วนกลางด้วยอลูมิเนียมอินกอท",
      endpoint: `${API_URL}/upload_and_update_ingot`,
    },
    {
      title: "ข้อมูล WBS unplanned",
      endpoint: `${API_URL}/upload_wbs_file`,
    },
  ];

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Handle form submission to upload the file
  const handleUpload = async (event, endpoint) => {
    event.preventDefault();

    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    setIsLoading(true);
    setUploadStatus(""); // Reset status before new upload

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUploadStatus(response.data.message || "Upload successful!");
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus(
        error.response?.data?.message || "Failed to upload the file."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <NavbarComponent />
      <div className="text-dropdown-container">
        <h1 className="header-title">จัดการข้อมูล</h1>
      </div>
      <div className="upload-container">
        <div className="upload-container-L1">
          {uploadSections.map((section, index) => (
            <div key={index} className="upload-module">
              <h1 className="text-title ">{section.title}</h1>
              <form
                ref={(el) => (formRefs.current[index] = el)}
                onSubmit={(event) => handleUpload(event, section.endpoint)}
                className="form-container"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />

                {/* Image for file selection */}
                <img
                  src={File}
                  alt="Select File"
                  className="file-image"
                  onClick={handleImageClick}
                />

                {selectedFile && <p>Selected: {selectedFile.name}</p>}

                {/* Image acting as the upload button */}
                <img
                  src={UploadButton}
                  alt="Upload"
                  className="upload-button-image"
                  onClick={() => formRefs.current[index].requestSubmit()}
                  disabled={isLoading}
                />
              </form>
            </div>
          ))}
          {uploadStatus && <p className="upload-status">{uploadStatus}</p>}
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
