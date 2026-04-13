import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SaveIcon from "@mui/icons-material/Save";
import PdfModalViewer from "../components/PdfModalViewer";
import { getEndItemById, updateEndItemNotes } from "../api/endItems";
import PdfGenerator from "../components/PdfGenerator";

export default function EndItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [openPdf, setOpenPdf] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    getEndItemById(id)
        .then((data) => {
          setItem(data);
          setNotes(data?.endItem?.notes || "");
          setLoading(false);
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          setError("Error loading item");
          setLoading(false);
        });
  }, [id]);

  const handleSaveNotes = () => {
    setSavingNotes(true);
    setSaveMessage("");

    updateEndItemNotes(id, notes)
        .then((data) => {
          setItem(data);
          setSaveMessage("Notes saved.");
          setSavingNotes(false);
        })
        .catch((err) => {
          console.error("Save error:", err);
          setSaveMessage("Could not save notes.");
          setSavingNotes(false);
        });
  };

  if (loading) {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Stack
              spacing={2}
              alignItems="center"
              justifyContent="center"
              sx={{ minHeight: "60vh" }}
          >
            <CircularProgress />
            <Typography>Loading end item...</Typography>
          </Stack>
        </Container>
    );
  }

  if (error) {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
    );
  }

  if (!item || !item.endItem) {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="warning">Item not found</Alert>
        </Container>
    );
  }

  const endItem = item.endItem;
  const imageUrl = endItem.image || "/no_image_found_placeholder.png";
  console.log(`image path is -> ${endItem}`)
  console.table(endItem)

  return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "center" }}
              spacing={2}
          >
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/equipment")}
                variant="outlined"
            >
              Back to Equipment
            </Button>

            <Box>
              <Typography variant="h4" fontWeight={700}>
                End Item Details
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Detailed equipment information
              </Typography>
            </Box>

            <Chip
                label={`NIIN: ${endItem.niin}`}
                variant="outlined"
                color="primary"
            />
          </Stack>

          <Divider />

          <Card variant="outlined">
            <CardContent>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h5" fontWeight={600}>
                    {endItem.description}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    LIN: {endItem.lin}
                  </Typography>
                </Box>

                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={3}
                    alignItems="stretch"
                >
                  <Stack spacing={2} sx={{ flex: 1.2 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Button
                        variant="outlined"
                        startIcon={<PictureAsPdfIcon />}
                        onClick={() => setOpenPdf(true)}
                        sx={{ alignSelf: "flex-start" }}
                      >
                        Open End Item BOM PDF
                      </Button>

                      <PdfGenerator />
                  </Stack>

                    <Card variant="outlined">
                      <CardContent>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                        >
                          Description
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {endItem.description}
                        </Typography>
                      </CardContent>
                    </Card>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                      <Card variant="outlined" sx={{ flex: 1 }}>
                        <CardContent sx={{ textAlign: "center" }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            FSC
                          </Typography>
                          <Typography variant="h6" fontWeight={600}>
                            {endItem.fsc}
                          </Typography>
                        </CardContent>
                      </Card>

                      <Card variant="outlined" sx={{ flex: 1 }}>
                        <CardContent sx={{ textAlign: "center" }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Auth Qty
                          </Typography>
                          <Typography variant="h6" fontWeight={600}>
                            {endItem.auth_qty}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Stack>

                <Card variant="outlined">
                  <CardContent>
                    <Stack spacing={2}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        Notes
                      </Typography>

                      <TextField
                          multiline
                          minRows={5}
                          fullWidth
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Add notes for this end item..."
                      />

                      <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={2}
                          justifyContent="space-between"
                          alignItems={{ xs: "stretch", sm: "center" }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {saveMessage}
                        </Typography>

                        <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleSaveNotes}
                            disabled={savingNotes}
                        >
                          {savingNotes ? "Saving..." : "Save Notes"}
                        </Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
                  </Stack>

                  <Card
                      variant="outlined"
                      sx={{
                        flex: 1,
                        minHeight: 280,
                        overflow: "hidden",
                        bgcolor: "grey.50",
                      }}
                  >
                    <Box
                        component="img"
                        src={imageUrl}
                        alt={endItem.description}
                        sx={{
                          width: "100%",
                          height: "100%",
                          minHeight: 280,
                          objectFit: "cover",
                          display: "block",
                        }}
                    />
                  </Card>
                </Stack>

                <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={() => navigate(`/InventoryTable/${id}`)}
                >
                  Start / Open Inventory
                </Button>
              </Stack>
            </CardContent>
          </Card>

          <PdfModalViewer
              open={openPdf}
              onClose={() => setOpenPdf(false)}
              pdfUrl="/pdfs/DET10_FWD_SHR_OCT25_FLAT.pdf"
          />
        </Stack>
      </Container>
  );
}