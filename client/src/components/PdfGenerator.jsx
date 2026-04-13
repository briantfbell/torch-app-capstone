import { useEffect, useState } from "react";
import { Box, Button, Stack, Tooltip, Typography } from "@mui/material";
import { jsPDF } from "jspdf";
import PdfModalViewer from "./PdfModalViewer";
import {Upload, SwapHoriz, Download, Preview, PictureAsPdf} from "@mui/icons-material";

//TO USE THIS: just import it and add <PdfGenerator /> wherever you want in your page

export default function PdfGenerator({ onComplete }) {
  const [images, setImages] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [open, setOpen] = useState(false);

  //upload images
  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    setPdfUrl(null); //reset previous pdf
    const mapped = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages(mapped);
  };

  //generate the pdf
  const handleGenerate = () => {
    if (!images.length) return alert("Upload images first");

    const pdf = new jsPDF();

    images.forEach((img, i) => {
      if (i > 0) pdf.addPage();
      pdf.addImage(img.url, "JPEG", 10, 10, 180, 160);
    });

    const blob = pdf.output("blob");
    const url = URL.createObjectURL(blob);

    //this creates the little blobby guy (its literally just a giant binary string in memory) and then creates a URL for it that we can use to preview or download the PDF without needing to send it to a server first
    setPdfUrl(url);

    //callback with the blob, url, and a suggested file name (you can use the blob to upload to a server, and the url for preview or download)
    onComplete?.({
      blob,
      url,
      fileName: `pdf-${Date.now()}.pdf`,
    });

    //reset images
    setImages([]);
  };

  useEffect(() => {
    return() => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl); //cleanup the blob url when the component unmounts or when a new PDF is generated (this prevents memory leakage)
      }
    }
  }, [pdfUrl]);

  return (
    <Stack alignItems="center" sx={{ p: 1, border: "1px solid #4c4c4c", borderRadius: 2 }}>
        <Stack spacing={2} direction="row" alignItems="center">

            {/*upload*/}
            <Button variant="contained" component="label" sx={{ height: "30px", width: "5px" }}>
                <Tooltip title="Upload one or more images (JPG, PNG, etc.)">
                    <Upload/>
                </Tooltip>
                <input hidden type="file" multiple accept="image/*" onChange={handleUpload} />
            </Button>

            {/*generate*/}
            <Button variant="contained" color="success" onClick={handleGenerate} sx={{ height: "30px", width: "5px" }}>
                <Tooltip title="Generate PDF">
                <PictureAsPdf />
                </Tooltip>
            </Button>

            {/*preview the pdf images*/}
            {pdfUrl && (
                <>
                <Button variant="outlined" onClick={() => setOpen(true)} sx={{ height: "30px", width: "5px" }}>
                    <Tooltip title="Preview PDF">
                    <Preview />
                    </Tooltip>
                </Button>

                <Button
                    variant="outlined"
                    component="a"
                    href={pdfUrl}
                    download="my-pdf.pdf"
                    sx={{ height: "30px", width: "5px" }}
                >
                    <Tooltip title="Download PDF">
                    <Download/>
                    </Tooltip>
                </Button>
                </>
            )}

            {!pdfUrl && images.length === 0 && (
                <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#888" }}>
                No PDF generated yet
                </Box>
            ) }

            {images.length > 0 && (
                <Typography variant="button" color="text.secondary">
                {images.length} image(s) ready to be included in the PDF
                </Typography>
            )}

            {/*modal view for the demo*/}
            <PdfModalViewer
                open={open}
                onClose={() => setOpen(false)}
                pdfUrl={pdfUrl}
            />
        </Stack>
    </Stack>
  );
}