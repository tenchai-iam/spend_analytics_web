import React, { useState } from "react";
import NavbarComponent from "../ComponentsPage/NavbarComponent";
import BackgroundComponent from "../ComponentsPage/BackgroundComponent";
import axios from "axios";
import "../ComponentsStyles/upload.css";

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Handle form submission to upload the file
  const handleUpload = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/upload", // Replace with your backend URL
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUploadStatus(response.data.message);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("Failed to upload the file.");
    }
  };

  return (
    <div>
      <NavbarComponent />
      <BackgroundComponent />
      <div className="upload-container">
        <div className="upload-container-L1">
          <div className="upload-module">
            <h1 className="text-title ">ข้อมูลยอดใช้งานต่อเดือน (R/M)</h1>
            <form onSubmit={handleUpload}>
              <input type="file" onChange={handleFileChange} />
              <button type="submit">Upload</button>
            </form>
            {uploadStatus && <p>{uploadStatus}</p>}
          </div>
          <div className="upload-module">
            <h1 className="text-title ">ข้อมูลยอดจ่ายเข้างานของพัสดุกรณีที่แตกต่างจากปกติ</h1>
            <form onSubmit={handleUpload}>
              <input type="file" onChange={handleFileChange} />
              <button type="submit">Upload</button>
            </form>
            {uploadStatus && <p>{uploadStatus}</p>}
          </div>
          <div className="upload-module">
            <h1 className="text-title ">ข้อมูลราคากลางที่ใช้ในการประมาณการงบประมาณ (Reference price)</h1>
            <form onSubmit={handleUpload}>
              <input type="file" onChange={handleFileChange} />
              <button type="submit">Upload</button>
            </form>
            {uploadStatus && <p>{uploadStatus}</p>}
          </div>
          <div className="upload-module">
            <h1 className="text-title ">ข้อมูลหน่วยนับ packaging</h1>
            <form onSubmit={handleUpload}>
              <input type="file" onChange={handleFileChange} />
              <button type="submit">Upload</button>
            </form>
            {uploadStatus && <p>{uploadStatus}</p>}
          </div>
          <div className="upload-module">
            <h1 className="text-title ">ข้อมูลการจัดกลุ่มประเภทพัสดุ</h1>
            <form onSubmit={handleUpload}>
              <input type="file" onChange={handleFileChange} />
              <button type="submit">Upload</button>
            </form>
            {uploadStatus && <p>{uploadStatus}</p>}
          </div>
          <div className="upload-module">
            <h1 className="text-title ">ข้อมูลพัสดุสายไฟที่มีการจ้างรีดที่ส่วนกลางด้วยอลูมิเนียมอินกอท</h1>
            <form onSubmit={handleUpload}>
              <input type="file" onChange={handleFileChange} />
              <button type="submit">Upload</button>
            </form>
            {uploadStatus && <p>{uploadStatus}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
