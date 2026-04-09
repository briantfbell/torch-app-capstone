import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Button, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export default function SHRViewPage() {
  const navigate = useNavigate();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [containerWidth, setContainerWidth] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width);
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };


  return (
    // Whole thing felt too big, if it's messing things up change the below line back to: <Stack spacing={2} sx={{ width: "100%", p: 3 }}>
    <Stack spacing={2} sx={{ width: "100%", p: 3, maxWidth: 1200, mx: "auto" }}>
      {/* Header bar - if we wind up moving it into the MiniDrawer so be it */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
      >
        <Typography variant="h5" fontWeight={700}>
          Sub Hand Receipt
        </Typography>

        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/equipment")}
          variant="outlined"
        >
          Back to Equipment
        </Button>
      </Stack>

      {/* PDF container */}
      <Stack
        ref={containerRef}
        alignItems="center"
        sx={{ width: "100%", border: "1px solid", borderColor: "divider" }}
      >
        {/* IMPORTANT! This is hard-coded to a specific PDF; if we are going to do it by UIC it will need to be changed and probably the source will not be /Public */}
        <Document
          file="/pdfs/1B10_SHR_flat.pdf"
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page
            pageNumber={pageNumber}
            width={containerWidth ? containerWidth : undefined}
          />
        </Document>
      </Stack>

      {/* Page navigation bar for PDF */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={2}
      >
        <Button
          variant="outlined"
          disabled={pageNumber <= 1}
          onClick={() => setPageNumber(pageNumber - 1)}
        >
          Previous Page
        </Button>
        <Typography>
          Page {pageNumber} of {numPages}
        </Typography>
        <Button
          variant="outlined"
          disabled={pageNumber >= numPages}
          onClick={() => setPageNumber(pageNumber + 1)}
        >
          Next Page
        </Button>
      </Stack>
    </Stack>
  );
}
