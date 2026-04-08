import { Box, Typography, Paper, Button, Chip, Divider } from "@mui/material";
import { useState } from "react";
import PdfModalViewer from "../components/PdfModalViewer";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";


export default function EndItemPage() {
  const [openPdf, setOpenPdf] = useState(false);

  const item = {
    inventoryName: "AN/PRC-117G",
    nsn: "5820-01-598-1234",
    commonName: "Radio Set",
    ui: "EA",
    aac: "AAC-12",
    description: "Multi-band manpack radio used for tactical communications.",
    lastSeen: "Warehouse A - Shelf 4",
    imageUrl: "/radio-photo.png",
    pdfUrl: "/pdfs/P05049 PUBLIC A 1.pdf",
  };

  return (
    <Box sx={styles.page}>
      <Box sx={styles.header}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            End Item Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Detailed equipment information
          </Typography>
        </Box>

        <Chip label={`NSN: ${item.nsn}`} variant="outlined" color="primary" />
      </Box>

      <Divider sx={{ width: "100%" }} />

      <Paper elevation={1} sx={styles.mainCard}>
        <Box sx={styles.titleSection}>
          <Typography variant="h5" fontWeight={600}>
            {item.inventoryName}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {item.nsn}
          </Typography>
        </Box>

        <Box sx={styles.topGrid}>
          <Box sx={styles.leftColumn}>
            <Button
              variant="outlined"
              startIcon={<PictureAsPdfIcon />}
              onClick={() => setOpenPdf(true)}
              sx={styles.pdfButton}
            >
              Open End Item BOM PDF
            </Button>

            <Paper variant="outlined" sx={styles.infoCard}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Common Name / Nickname
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {item.commonName}
              </Typography>
            </Paper>

            <Box sx={styles.smallInfoGrid}>
              <Paper variant="outlined" sx={styles.smallInfoCard}>
                <Typography variant="subtitle2" color="text.secondary">
                  UI
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {item.ui}
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={styles.smallInfoCard}>
                <Typography variant="subtitle2" color="text.secondary">
                  AAC
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {item.aac}
                </Typography>
              </Paper>
            </Box>
          </Box>

          <Paper variant="outlined" sx={styles.imageCard}>
            <Box
              component="img"
              src={item.imageUrl}
              alt={item.commonName}
              sx={styles.image}
            />
          </Paper>
        </Box>

        <Paper variant="outlined" sx={styles.sectionCard}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Description
          </Typography>
          <Typography variant="body1">{item.description}</Typography>
        </Paper>

        <Paper variant="outlined" sx={styles.sectionCard}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Last Seen
          </Typography>
          <Typography variant="body1">{item.lastSeen}</Typography>
        </Paper>

        <Button variant="contained" size="large" sx={styles.actionButton}>
          Start / Open Inventory
        </Button>
      </Paper>

      <PdfModalViewer
        open={openPdf}
        onClose={() => setOpenPdf(false)}
        pdfUrl={item.pdfUrl}
      />
    </Box>
  );
}

const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
    p: 3,
    width: "100%",
    maxWidth: 1200,
    mx: "auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: { xs: "flex-start", sm: "center" },
    flexDirection: { xs: "column", sm: "row" },
    gap: 2,
    width: "100%",
  },

  mainCard: {
    p: { xs: 2, md: 3 },
    borderRadius: 2,
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },

  titleSection: {
    display: "flex",
    flexDirection: "column",
    gap: 0.5,
  },

  topGrid: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" },
    gap: 3,
    alignItems: "stretch",
  },

  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },

  pdfButton: {
    alignSelf: "flex-start",
  },

  infoCard: {
    p: 2,
    borderRadius: 2,
  },

  smallInfoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 2,
  },

  smallInfoCard: {
    p: 2,
    borderRadius: 2,
    textAlign: "center",
  },

  imageCard: {
    minHeight: 280,
    borderRadius: 2,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    bgcolor: "grey.50",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  sectionCard: {
    p: 2,
    borderRadius: 2,
  },

  actionButton: {
    alignSelf: "stretch",
  },
};
