import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Divider,
    Grid,
    Skeleton,
    Stack,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PdfModalViewer from "../components/PdfModalViewer";

export default function EndItemPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [item, setItem] = useState(null);
    const [openPdf, setOpenPdf] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`http://localhost:8080/end-items/${id}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch item");
                }
                return res.json();
            })
            .then((data) => {
                setItem(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Fetch error:", err);
                setError("Error loading item");
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Stack spacing={3}>
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        spacing={2}
                    >
                        <Skeleton variant="rounded" width={180} height={40} />
                        <Box>
                            <Skeleton variant="text" width={260} height={48} />
                            <Skeleton variant="text" width={220} height={24} />
                        </Box>
                        <Skeleton variant="rounded" width={150} height={32} />
                    </Stack>

                    <Skeleton variant="rectangular" height={2} />

                    <Card variant="outlined">
                        <CardContent>
                            <Stack spacing={3}>
                                <Box>
                                    <Skeleton variant="text" width="50%" height={40} />
                                    <Skeleton variant="text" width="25%" height={28} />
                                </Box>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={7}>
                                        <Stack spacing={2}>
                                            <Skeleton variant="rounded" width={220} height={40} />
                                            <Skeleton variant="rounded" height={90} />
                                            <Grid container spacing={2}>
                                                <Grid item xs={6}>
                                                    <Skeleton variant="rounded" height={90} />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Skeleton variant="rounded" height={90} />
                                                </Grid>
                                            </Grid>
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={12} md={5}>
                                        <Skeleton variant="rounded" height={280} />
                                    </Grid>
                                </Grid>

                                <Skeleton variant="rounded" height={88} />
                                <Skeleton variant="rounded" height={88} />
                                <Skeleton variant="rounded" height={44} />
                            </Stack>
                        </CardContent>
                    </Card>
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

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={7}>
                                    <Stack spacing={2}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<PictureAsPdfIcon />}
                                            onClick={() => setOpenPdf(true)}
                                            sx={{ alignSelf: "flex-start" }}
                                        >
                                            Open End Item BOM PDF
                                        </Button>

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

                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <Card variant="outlined">
                                                    <CardContent sx={{ textAlign: "center" }}>
                                                        <Typography variant="subtitle2" color="text.secondary">
                                                            FSC
                                                        </Typography>
                                                        <Typography variant="h6" fontWeight={600}>
                                                            {endItem.fsc}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>

                                            <Grid item xs={12} sm={6}>
                                                <Card variant="outlined">
                                                    <CardContent sx={{ textAlign: "center" }}>
                                                        <Typography variant="subtitle2" color="text.secondary">
                                                            Auth Qty
                                                        </Typography>
                                                        <Typography variant="h6" fontWeight={600}>
                                                            {endItem.auth_qty}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        </Grid>
                                    </Stack>
                                </Grid>

                                <Grid item xs={12} md={5}>
                                    <Card
                                        variant="outlined"
                                        sx={{
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
                                                height: 280,
                                                objectFit: "cover",
                                                display: "block",
                                            }}
                                        />
                                    </Card>
                                </Grid>
                            </Grid>

                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                        NIIN
                                    </Typography>
                                    <Typography variant="body1">{endItem.niin}</Typography>
                                </CardContent>
                            </Card>

                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                        LIN
                                    </Typography>
                                    <Typography variant="body1">{endItem.lin}</Typography>
                                </CardContent>
                            </Card>

                            <Button variant="contained" size="large" fullWidth>
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