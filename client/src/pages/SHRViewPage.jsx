import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
// remember to npm install react-pdf
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const SHRViewerPage = () => {
  const navigate = useNavigate();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div>
      <div>
        <button onClick={() => navigate("/equipment")}>
          Back to Equipment
        </button>
      </div>
      <h1>Sub Hand Receipt</h1>
      <Document
        file="/pdfs/DET10_FWD_SHR_OCT25_FLAT.pdf"
        onLoadSuccess={onDocumentLoadSuccess}
      >
        {/* if it needs rotating, change Page div to  <Page pageNumber={pageNumber} rotate={90} scale={1.3} /> */}
        <Page pageNumber={pageNumber} scale={1.4} />
      </Document>
      <br />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
        }}
      >
        <button
          disabled={pageNumber <= 1}
          onClick={() => setPageNumber(pageNumber - 1)}
        >
          Previous Page
        </button>
        <p>
          Page {pageNumber} of {numPages}
        </p>
        <button
          disabled={pageNumber >= numPages}
          onClick={() => setPageNumber(pageNumber + 1)}
        >
          Next Page
        </button>
      </div>
    </div>
  );
};

export default SHRViewerPage;
