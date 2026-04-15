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
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SaveIcon from "@mui/icons-material/Save";
import PdfModalViewer from "../components/PdfModalViewer";
import { getEndItemById, updateEndItemNotes } from "../api/endItems";
import PdfGenerator from "../components/PdfGenerator";
import { savePdf, getPdfsByEndItem } from "../utils/pdfStorage";
import PdfFillModal from "../components/PdfFillModal";
import { useQuery } from "@tanstack/react-query";
import {tryGetSerialItems} from "../api/data.js";

export default function EndItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedSerialId = searchParams.get("serialId");

  const [uic, setUic] = useState("");
  const [item, setItem] = useState(null);
  const [openPdf, setOpenPdf] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);
  const [localPdfs, setLocalPdfs] = useState([]);
  const [openFillModal, setOpenFillModal] = useState(false);

  const { data: serialEndItemsData = [] } = useQuery({
    queryKey: ["serialEndItems"],
    queryFn: tryGetSerialItems,
    select: (d) => d.allSerialEndItems ?? [],
  });

  const matchingSerialItems = serialEndItemsData.filter(
        (serialItem) => Number(serialItem.end_item_id) === Number(id)
    );
  const selectedSerial = matchingSerialItems.find(
        (serialItem) => String(serialItem.id) === String(selectedSerialId)
    );

  const loadPdfs = async () => {
    try {
      const results = await getPdfsByEndItem(id);
      const withUrls = results.map((pdf) => ({
        ...pdf,
        url: URL.createObjectURL(pdf.blob),
      }));
      setLocalPdfs(withUrls);
    } catch (err) {
      console.error("Error loading saved PDFs:", err);
      setLocalPdfs([]);
    }
  };

  useEffect(() => {
    fetch("http://localhost:8080/auth/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setUic(data.user?.uic ?? ""))
      .catch((err) => console.error("Failed to load user:", err));
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadPage = async () => {
      setLoading(true);
      setError("");

      try {
        await loadPdfs();
        const data = await getEndItemById(id);

        if (!isMounted) return;

        setItem(data);
        setNotes(data?.endItem?.note || "");
      } catch (err) {
        console.error("Fetch error:", err);
        if (isMounted) {
          setError("Error loading item");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadPage();

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (!item?.endItem?.lin) {
      setPdfUrl(null);
      return;
    }

    const currentLin = String(item.endItem.lin).trim().toLowerCase();

    fetch("/pdfs/pdfManifest.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Could not load PDF manifest");
        }
        return res.json();
      })
      .then((files) => {
        const match = files.find((file) =>
          String(file).trim().toLowerCase().includes(currentLin),
        );

        setPdfUrl(match ? `/pdfs/${match}` : null);
      })
      .catch((err) => {
        console.error("PDF manifest error:", err);
        setPdfUrl(null);
      });
  }, [item]);

  useEffect(() => {
    return () => {
      localPdfs.forEach((pdf) => {
        if (pdf.url) {
          URL.revokeObjectURL(pdf.url);
        }
      });
    };
  }, [localPdfs]);

  const handleSaveNotes = () => {
    setSavingNotes(true);
    setSaveMessage("");

    updateEndItemNotes(id, notes)
      .then(() => getEndItemById(id))
      .then((freshItem) => {
        setItem(freshItem);
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
              {endItem.description}
            </Typography>
          </Box>

          <Stack>
            <Chip
              label={uic ? `UIC: ${uic}` : "Loading..."}
              variant="outlined"
              color="primary"
            />
          </Stack>
        </Stack>

        <Card variant="outlined">
          <CardContent>
            <Stack spacing={3}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={3}
                alignItems="stretch"
              >
                <Stack spacing={2} sx={{ flex: 1.2 }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    flexWrap="wrap"
                  >
                    {pdfUrl ? (
                      <Button
                        variant="outlined"
                        startIcon={<PictureAsPdfIcon />}
                        onClick={() => setOpenPdf(true)}
                        sx={{ alignSelf: "flex-start" }}
                      >
                        Open End Item BOM PDF
                      </Button>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No BOM for this item.
                      </Typography>
                    )}

                    <PdfGenerator
                      onComplete={async ({ blob, fileName }) => {
                        await savePdf({
                          endItemId: id,
                          name: fileName,
                          blob,
                        });
                        await loadPdfs();
                      }}
                    />
                  </Stack>

                  <Card variant="outlined">
                    <CardContent
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 2,
                        flexWrap: "wrap",
                      }}
                    >
                      {[
                        { label: `NIIN: ${endItem.niin}`, color: "primary" },
                        { label: `LIN: ${endItem.lin}`, color: "primary" },
                        { label: `SERIAL: ${selectedSerial.serial_number}`, color: "primary" },
                        { label: `Cost: $${endItem.cost}`, color: "success" }
                      ].map(({ label, color }) => (
                        <Chip
                          key={label}
                          label={label}
                          variant="outlined"
                          color={color}
                          sx={{ minWidth: 140, flexBasis: "calc(50% - 8px)" }}
                        />
                      ))}
                    </CardContent>
                  </Card>

                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: "center" }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Authorized Quantity
                      </Typography>
                      <br />
                      <Typography variant="h6" fontWeight={600}>
                        {endItem.auth_qty}
                      </Typography>
                    </CardContent>
                  </Card>

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

                  <Card variant="outlined">
                    <CardContent>
                      <Stack spacing={2}>
                        <Typography variant="h6">Custom 2062</Typography>

                        <Button
                          variant="contained"
                          onClick={() => setOpenFillModal(true)}
                        >
                          Fill Out 2062 Form
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>

                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Saved PDFs
                      </Typography>

                      {localPdfs.length === 0 && (
                        <Typography variant="body2" color="text.secondary">
                          No saved PDFs for this item.
                        </Typography>
                      )}

                      <Stack spacing={1}>
                        {localPdfs.map((pdf) => (
                          <Button
                            key={pdf.id}
                            variant="outlined"
                            onClick={() => {
                              setPdfUrl(pdf.url);
                              setOpenPdf(true);
                            }}
                          >
                            {pdf.name}
                          </Button>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </Stack>

                <Divider
                  flexItem
                  orientation="vertical"
                  sx={{ display: { xs: "none", md: "block" } }}
                />
                <Divider sx={{ display: { xs: "block", md: "none" } }} />

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
                onClick={() => navigate(`/equipment/${id}/inventory`)}
              >
                Start / Open Inventory
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {pdfUrl && (
          <PdfModalViewer
            open={openPdf}
            onClose={() => setOpenPdf(false)}
            pdfUrl={pdfUrl}
          />
        )}

        <PdfFillModal
          open={openFillModal}
          onClose={() => setOpenFillModal(false)}
          templateUrl="/templates/2062MainTemplate.pdf"
          onUpload={async (pdf) => {
            await savePdf({
              endItemId: id,
              name: pdf.name,
              blob: pdf.file,
            });
            await loadPdfs();
          }}
        />
      </Stack>
    </Container>
  );
}
