import { Box, Typography, Paper, Button } from "@mui/material";
import { useState } from "react";
import MiniDrawer from "../components/ui/MiniDrawer";
import PdfModalViewer from "../components/PdfModalViewer";

export default function EndItemPage() {
  const [openPdf, setOpenPdf] = useState(false);

  const item = {
    inventoryName: "AN/PRC-117G",
    nsn: "5820-01-598-1234",
    commonName: "Radio Set",
    ui: "UI-001",
    aac: "AAC-12",
    description: "Multi-band manpack radio used for tactical communications.",
    lastSeen: "Warehouse A - Shelf 4",
    imageUrl: "/radio-photo.png",
    pdfUrl: "/inventory-guide.pdf",
  };

  return (
    <MiniDrawer>
      <Box
        sx={{ color: "white", bgcolor: "#0b0b0b", minHeight: "100vh", p: 3 }}
      >
        <Paper
          sx={{
            bgcolor: "#111",
            p: 4,
            borderRadius: 4,
            border: "2px solid #d9d9d9",
          }}
        >
          <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
            {item.inventoryName}, {item.nsn}
          </Typography>

          <Button
            fullWidth
            variant="outlined"
            onClick={() => setOpenPdf(true)}
            sx={{ mb: 3, color: "white", borderColor: "white" }}
          >
            Open End Item BOM PDF
          </Button>

          <Typography>{item.commonName}</Typography>
          <Typography>UI: {item.ui}</Typography>
          <Typography>AAC: {item.aac}</Typography>

          <Typography sx={{ mt: 2 }}>{item.description}</Typography>

          <Typography sx={{ mt: 2 }}>Last Seen: {item.lastSeen}</Typography>
        </Paper>

        <PdfModalViewer
          open={openPdf}
          onClose={() => setOpenPdf(false)}
          pdfUrl={item.pdfUrl}
        />
      </Box>
    </MiniDrawer>
  );
}
