import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {useEffect, useState} from "react";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import SaveIcon from "@mui/icons-material/Save";
import PdfModalViewer from "../components/PdfModalViewer";
import {getEndItemById, getEndItemCurrentHistory, updateEndItemNotes} from "../api/endItems";
import PdfGenerator from "../components/PdfGenerator";
import {getPdfsByEndItem, savePdf} from "../utils/pdfStorage";
import PdfFillModal from "../components/PdfFillModal";
import {useQuery} from "@tanstack/react-query";
import {tryGetSerialItems} from "../api/data.js";
import {postEndItemSeen} from "../api/endItems.js";

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
  const [currUser, setCurrUser] = useState(null)
  const [seen, setSeen] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);
  const [confirmSeenOpen, setConfirmSeenOpen] = useState(false);
  const [confirmNotSeenOpen, setConfirmNotSeenOpen] = useState(false);

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
    fetch("http://localhost:8080/auth/me", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => setCurrUser(data.user ?? null))
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
    if (!selectedSerialId) return;

    getEndItemCurrentHistory()
        .then((data) => data.filter((i) => i.serial_number === parseInt(selectedSerialId)))
        .then((data) => {
          setSeen(data[0].seen);
          setLastSeen(data[0].last_seen ?? null);
        })
        .catch((err) => console.error("Failed to load seen status:", err));
  }, [selectedSerialId]);

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
        <Box sx={{ maxWidth: 1500, mx: 'auto', width: '100%', py: 4 }}>
          <Stack
              spacing={2}
              alignItems="center"
              justifyContent="center"
              sx={{ minHeight: "60vh" }}
          >
            <CircularProgress />
            <Typography>Loading end item...</Typography>
          </Stack>
        </Box>
    );
  }

  if (error) {
    return (
        <Box sx={{ maxWidth: 1500, mx: 'auto', width: '100%', py: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
    );
  }

  if (!item || !item.endItem) {
    return (
        <Box sx={{ maxWidth: 1500, mx: 'auto', width: '100%', py: 4 }}>
          <Alert severity="warning">Item not found</Alert>
        </Box>
    );
  }

  const endItem = item.endItem;
  const imageUrl = endItem.image || "/no_image_found_placeholder.png";

  const cardSx = {
    elevation: 0,
    borderRadius: 4,
    border: "1px solid",
    borderColor: "divider",
  };

  return (
      <Box sx={{ maxWidth: 1500, mx: 'auto', width: '100%', py: 4 }}>
        <Stack spacing={3}>

          <Box>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/equipment")}
                variant="outlined"
            >
              Back to Equipment
            </Button>
          </Box>

          <Card elevation={0} sx={cardSx}>
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  spacing={2}
              >
                <Stack spacing={0.5}>
                  <Typography variant="overline" color="primary" fontWeight={700}>
                    End Item
                  </Typography>
                  <Typography variant="h4" fontWeight={800}>
                    {endItem.description}
                  </Typography>
                </Stack>

                <Chip
                    label={uic ? `UIC: ${uic}` : "Loading..."}
                    variant="outlined"
                    color="primary"
                />
              </Stack>
            </CardContent>
          </Card>

          <Card elevation={0} sx={cardSx}>
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Stack spacing={3}>
                <Stack spacing={0.75}>
                  <Typography variant="h6" fontWeight={700}>
                    Overview
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Item identifiers, availability, and quick actions.
                  </Typography>
                </Stack>

                <Divider />

                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={3}
                    alignItems="flex-start"
                >
                  <Stack
                      spacing={1}
                      sx={{ width: { xs: "100%", sm: 240, md: 280 }, flexShrink: 0 }}
                  >
                    <Box
                        sx={{
                          width: "100%",
                          aspectRatio: "1 / 1",
                          overflow: "hidden",
                          borderRadius: 2,
                          border: "1px solid",
                          borderColor: "divider",
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
                            objectFit: "cover",
                            display: "block",
                          }}
                      />
                    </Box>

                    <Button
                        fullWidth
                        variant={seen ? "contained" : "outlined"}
                        color={seen ? "success" : "primary"}
                        startIcon={seen ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                        onClick={() => seen ? setConfirmNotSeenOpen(true) : setConfirmSeenOpen(true)}
                    >
                      {seen ? "Seen" : "Mark as Seen"}
                    </Button>

                    {lastSeen && (
                      <Typography variant="overline" color="text.secondary" textAlign="center">
                        Last seen: {new Date(lastSeen).toLocaleString()}
                      </Typography>
                    )}
                  </Stack>

                  <Stack spacing={3} sx={{ flex: 1, minWidth: 0 }}>
                    <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 1,
                        }}
                    >
                      {[
                        { label: `NIIN: ${endItem.niin}`, color: "primary" },
                        { label: `LIN: ${endItem.lin}`, color: "primary" },
                        { label: `Serial: ${selectedSerial.serial_number}`, color: "primary" },
                        { label: `Cost: $${endItem.cost}`, color: "success" },
                      ].map(({ label, color }) => (
                          <Chip
                              key={label}
                              label={label}
                              variant="outlined"
                              color={color}
                              sx={{ width: "100%" }}
                          />
                      ))}
                    </Box>

                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        Authorized Quantity:
                      </Typography>
                      <Typography variant="body1" fontWeight={700}>
                        {endItem.auth_qty}
                      </Typography>
                    </Stack>

                    <Divider />

                    <Stack spacing={1.5}>
                      {pdfUrl ? (
                          <Button
                              variant="outlined"
                              startIcon={<PictureAsPdfIcon />}
                              onClick={() => setOpenPdf(true)}
                              fullWidth
                          >
                            Open End Item BOM PDF
                          </Button>
                      ) : (
                          <Typography variant="body2" color="text.secondary">
                            No BOM PDF available for this item.
                          </Typography>
                      )}

                      <Box>
                        <PdfGenerator
                            onComplete={async ({ blob, fileName }) => {
                              await savePdf({ endItemId: id, name: fileName, blob });
                              await loadPdfs();
                            }}
                        />
                      </Box>

                      <Dialog open={confirmSeenOpen} onClose={() => setConfirmSeenOpen(false)} fullWidth maxWidth="xs">
                        <DialogTitle>Mark as seen?</DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            Confirm that you have physically seen this item during inventory.
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={() => setConfirmSeenOpen(false)}>Cancel</Button>
                          <Button
                              variant="contained"
                              onClick={() => {
                                setSeen(true);
                                postEndItemSeen(true, "NA", new Date().toISOString(), "NA", currUser.id, id, selectedSerial?.serial_number);
                                setConfirmSeenOpen(false);
                              }}
                              autoFocus
                          >
                            Confirm
                          </Button>
                        </DialogActions>
                      </Dialog>

                      <Dialog open={confirmNotSeenOpen} onClose={() => setConfirmNotSeenOpen(false)} fullWidth maxWidth="xs">
                        <DialogTitle>Mark as not seen?</DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            This will remove the seen status for this item.
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={() => setConfirmNotSeenOpen(false)}>Cancel</Button>
                          <Button
                              variant="contained"
                              onClick={() => {
                                setSeen(false);
                                postEndItemSeen(false, "NA", new Date().toISOString(), "NA", currUser.id, id, selectedSerial?.serial_number);
                                setConfirmNotSeenOpen(false);
                              }}
                              autoFocus
                          >
                            Confirm
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={3}
              alignItems="stretch"
          >
            <Card elevation={0} sx={{ ...cardSx, flex: 2 }}>
              <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                <Stack spacing={3}>
                  <Stack spacing={0.75}>
                    <Typography variant="h6" fontWeight={700}>
                      Notes
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Attach operational notes or observations for this item.
                    </Typography>
                  </Stack>

                  <Divider />

                  <TextField
                      multiline
                      minRows={6}
                      fullWidth
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add notes for this end item..."
                  />

                  <Stack
                      direction="row"
                      spacing={2}
                      justifyContent="space-between"
                      alignItems="center"
                  >
                    <Typography variant="body2" color="text.secondary">
                      {saveMessage}
                    </Typography>

                    <Button
                        variant="outlined"
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

            <Card elevation={0} sx={{ ...cardSx, flex: 1 }}>
              <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                <Stack spacing={3}>
                  <Stack spacing={0.75}>
                    <Typography variant="h6" fontWeight={700}>
                      Documents
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Forms and saved PDFs for this item.
                    </Typography>
                  </Stack>

                  <Divider />

                  <Stack spacing={1.5}>
                    <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "0.7rem" }}>
                      Custom 2062
                    </Typography>
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => setOpenFillModal(true)}
                    >
                      Fill Out 2062 Form
                    </Button>
                  </Stack>

                  <Divider />

                  <Stack spacing={1.5}>
                    <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "0.7rem" }}>
                      Saved PDFs
                    </Typography>

                    {localPdfs.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                          No saved PDFs for this item.
                        </Typography>
                    ) : (
                        <Stack spacing={1}>
                          {localPdfs.map((pdf) => (
                              <Button
                                  key={pdf.id}
                                  variant="outlined"
                                  fullWidth
                                  onClick={() => {
                                    setPdfUrl(pdf.url);
                                    setOpenPdf(true);
                                  }}
                              >
                                {pdf.name}
                              </Button>
                          ))}
                        </Stack>
                    )}
                  </Stack>
                </Stack>
              </CardContent>
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
      </Box>
  );
}
