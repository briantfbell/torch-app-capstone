import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
// remember to npm install react-pdf
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Box, Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export default function SHRViewPage() {
  const navigate = useNavigate();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const { id } = useParams()
  const { user } = useAuth()

  if (user && user.uic !== id) {
    return <div>Access Denied</div>
  }

  return (
    <Box sx={styles.page}>
      <Box sx={styles.header}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/equipment")}
          variant="outlined"
        >
          Back to Equipment
        </Button>
        <Typography variant="h5" fontWeight={700}>
          Sub Hand Receipt
        </Typography>
      </Box>

      <Box sx={styles.pdfContainer}>
        <Document
          file="/pdfs/DET10_FWD_SHR_OCT25_FLAT.pdf"
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page pageNumber={pageNumber} scale={1.4} />
        </Document>
      </Box>

      <Box sx={styles.controls}>
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
      </Box>
    </Box>
  );
};

// ============================================================
// ALL STYLES IN ONE PLACE
// ============================================================
// To change how something looks, find its key here and edit the sx values
// MUI sx props use the same names as CSS but camelCased (e.g. marginBottom = mb)

const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    p: 3,
    maxWidth: 900,
    mx: "auto",
    width: "100%",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "122%",
  },

  pdfContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    border: "2px solid #d9d9d9",
  },

  controls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
};
