import React, { useState } from "react";
import NavbarComponent from "../ComponentsPage/NavbarComponent";
import BackgroundComponent from "../ComponentsPage/BackgroundComponent";
import axios from "axios";
import "../ComponentsStyles/upload.css";

const API_URL = "https://dev-spendi-tcc.pea.co.th/api";

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div>
      <NavbarComponent />
      <BackgroundComponent />
      <div className="upload-container">
        <div className="upload-container-L1">
          {uploadSections.map((section, index) => (
            <div key={index} className="upload-module">
              <h1 className="text-title ">{section.title}</h1>
              <form onSubmit={(event) => handleUpload(event, section.endpoint)}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit" disabled={isLoading}>
                  {isLoading ? "Uploading..." : "Upload"}
                </button>
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
