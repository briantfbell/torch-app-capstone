import React, { useState } from "react";
import { jsPDF } from "jspdf";

export default function ImageToPdfScanner() {
  const [images, setImages] = useState([]);


  //image uploading
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...imageFiles]);
  };

  //generate pdf from image
  const generatePDF = () => {
    if (images.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    const pdf = new jsPDF();
    images.forEach((img, idx) => {
      if (idx > 0) pdf.addPage();
      pdf.addImage(img.url, "JPEG", 10, 10, 180, 160);
    });
    pdf.save("images_with_text.pdf");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Image to PDF Converter</h2>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
      />

      <div style={{ marginTop: "20px" }}>
        {images.map((img, idx) => (
          <div
            key={idx}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <img
              src={img.url}
              alt={`upload-${idx}`}
              style={{ maxWidth: "200px", display: "block", marginBottom: "10px" }}
            />
          </div>
        ))}
      </div>

      <button
        onClick={generatePDF}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "#4CAF50",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Generate PDF
      </button>
    </div>
  );
}
