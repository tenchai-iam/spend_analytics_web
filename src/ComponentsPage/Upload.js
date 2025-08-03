import React, { useState, useRef } from "react";
import NavbarComponent from "../ComponentsPage/NavbarComponent";
import axios from "axios";
import File from "../pic/File.svg";
import UploadButton from "../pic/Upload.svg";
import "../ComponentsStyles/upload.css";

const API_URL = process.env.REACT_APP_API_URL;

const UploadPage = () => {
  const [selectedFiles, setSelectedFiles] = useState({});
  const [uploadStatus, setUploadStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRefs = useRef({});
  const formRefs = useRef({});

  // Configuration for each upload section
  const uploadSections = [
    {
      title: "ข้อมูลยอดใช้งานต่อเดือน (R/M)",
      endpoint: `${API_URL}/upload_and_update_rm_input`,
      downloadEndpoint: `${API_URL}/download_data_rm`, // Add a download API
      filename: "rm_input_template.xlsx",
    },
    {
      title: "ข้อมูลยอดจ่ายเข้างานของพัสดุกรณีที่แตกต่างจากปกติ",
      endpoint: `${API_URL}/upload_and_update_rm_special_input`,
      downloadEndpoint: `${API_URL}/download_data_rm_special`, // Add a download API
      filename: "rm_special_template.xlsx",
    },
    {
      title: "ข้อมูลราคากลางสำหรับประมาณการงบประมาณ (Reference price)",
      endpoint: `${API_URL}/upload_and_update_medium_price`,
      downloadEndpoint: `${API_URL}/download_data_medium_price`, // Add a download API
      filename: "reference_price_template.xlsx",
    },
    {
      title: "ข้อมูลหน่วยนับ packaging",
      endpoint: `${API_URL}/upload_and_update_package`,
      downloadEndpoint: `${API_URL}/download_data_package`, // Add a download API
      filename: "packaging_template.xlsx",
    },
    {
      title: "ข้อมูลการจัดกลุ่มประเภทพัสดุ",
      endpoint: `${API_URL}/upload_and_update_category_group`,
      downloadEndpoint: `${API_URL}/download_data_cat_group`, // Add a download API
      filename: "cat_group_data_template.xlsx",
    },
    {
      title: "ข้อมูลพัสดุสายไฟที่มีการจ้างรีดที่ส่วนกลางด้วยอลูมิเนียมอินกอท",
      endpoint: `${API_URL}/upload_and_update_ingot`,
      downloadEndpoint: `${API_URL}/download_data_ingot`, // Add a download API
      filename: "ingot_data_template.xlsx",
    },
    {
      title: "ข้อมูลพัสดุที่ต้องทำแผนจัดซื้อ",
      endpoint: `${API_URL}/upload_and_update_plan_volume_allocation`,
      downloadEndpoint: `${API_URL}/download_data_plan_volume_allocation`, // Add a download API
      filename: "plan_allocation.xlsx",
    },
    {
      title: "ข้อมูล WBS plan งบ P&I และอื่นๆ",
      endpoint: `${API_URL}/upload_wbs_planpi_file`,
      downloadEndpoint: `${API_URL}/download_wbs_plan_pi`, // Add a download API
      filename: "WBS_plan_pi_template.xlsx",
    },
    {
      title: "ข้อมูล WBS unplanned งบ P&I และอื่นๆ",
      endpoint: `${API_URL}/upload_wbs_unplanpi_file`,
      downloadEndpoint: `${API_URL}/download_wbs_unplan_pi`, // Add a download API
      filename: "WBS_unplan_pi_template.xlsx",
    },
    {
      title: "ข้อมูล WBS plan งบ C",
      endpoint: `${API_URL}/upload_wbs_planc_file`,
      downloadEndpoint: `${API_URL}/download_wbs_plan_c`, // Add a download API
      filename: "WBS_plan_c_template.xlsx",
    },
    {
      title: "ข้อมูล WBS unplanned งบ C",
      endpoint: `${API_URL}/upload_wbs_unplanc_file`,
      downloadEndpoint: `${API_URL}/download_wbs_unplan_c`, // Add a download API
      filename: "WBS_unplan_c_template.xlsx",
    },
  ];

  const handleFileChange = (event, index) => {
    setSelectedFiles((prev) => ({
      ...prev,
      [index]: event.target.files[0],
    }));
  };

  const handleUpload = async (event, index, endpoint) => {
    event.preventDefault();

    const file = selectedFiles[index];
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    setIsLoading(true);
    setUploadStatus(""); // Reset status before new upload

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
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

  const handleDownload = async (downloadEndpoint, fileName) => {
    try {
      const response = await fetch(downloadEndpoint, {
        method: "POST", // Change to POST
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ excel: 1 }), // Send { value: 1 }
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
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
              <div className="title-download-container">
                <h1 className="upload-title">{section.title}</h1>
                {section.downloadEndpoint && section.filename && (
                  <button
                    className="download-button"
                    onClick={() =>
                      handleDownload(section.downloadEndpoint, section.filename)
                    }
                  >
                    Download Template
                  </button>
                )}
              </div>
              <form
                ref={(el) => (formRefs.current[index] = el)}
                onSubmit={(event) =>
                  handleUpload(event, index, section.endpoint)
                }
                className="form-container"
              >
                <input
                  type="file"
                  ref={(el) => (fileInputRefs.current[index] = el)}
                  onChange={(event) => handleFileChange(event, index)}
                  style={{ display: "none" }}
                />
                <img
                  src={File}
                  alt="Select File"
                  className="file-image"
                  onClick={() => fileInputRefs.current[index]?.click()}
                />
                {selectedFiles[index] && (
                  <p>Selected: {selectedFiles[index].name}</p>
                )}
                <img
                  src={UploadButton}
                  alt="Upload"
                  className="upload-button-image"
                  onClick={() => formRefs.current[index]?.requestSubmit()}
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
