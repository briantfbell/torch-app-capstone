import { Box, Typography, Paper, Button, Chip, Divider } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import PdfModalViewer from "../components/PdfModalViewer";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";


export default function EndItemPage() {
    const { id } = useParams();
    const [openPdf, setOpenPdf] = useState(false);
    const navigate = useNavigate();

    const MOCK_END_ITEMS = [
        {
            id: 1,
            inventoryItem: "00123",
            nsn: "1005-01-123-4567",
            commonName: "M4 Carbine",
            description: "Rifle, 5.56mm",
            ui: "EA",
        },
        {
            id: 2,
            inventoryItem: "00124",
            nsn: "1005-01-234-5678",
            commonName: "M249 SAW",
            description: "Machine Gun, 5.56mm",
            ui: "EA",
        },
        {
            id: 3,
            inventoryItem: "00125",
            nsn: "2350-01-345-6789",
            commonName: "HMMWV",
            description: "High Mobility Multipurpose Wheeled Vehicle",
            ui: "EA",
        },
        {
            id: 4,
            inventoryItem: "00126",
            nsn: "5855-01-456-7890",
            commonName: "AN/PVS-14",
            description: "Night Vision Monocular",
            ui: "EA",
        },
        {
            id: 5,
            inventoryItem: "00127",
            nsn: "5820-01-567-8901",
            commonName: "SINCGARS",
            description: "Single Channel Ground and Airborne Radio System",
            ui: "EA",
        },
        {
            id: 6,
            inventoryItem: "00128",
            nsn: "1240-01-678-9012",
            commonName: "M68 CCO",
            description: "Close Combat Optic",
            ui: "EA",
        },
        {
            id: 7,
            inventoryItem: "00129",
            nsn: "8465-01-789-0123",
            commonName: "IOTV",
            description: "Improved Outer Tactical Vest",
            ui: "EA",
        },
        {
            id: 8,
            inventoryItem: "00130",
            nsn: "1005-01-383-2872",
            commonName: "M9 Pistol",
            description: "Pistol, Semiautomatic, 9mm",
            ui: "EA",
        },
        {
            id: 9,
            inventoryItem: "00131",
            nsn: "1005-01-565-6237",
            commonName: "M17 Pistol",
            description: "Pistol, Semiautomatic, 9mm, M17",
            ui: "EA",
        },
        {
            id: 10,
            inventoryItem: "00132",
            nsn: "1005-01-357-5339",
            commonName: "M240B",
            description: "Machine Gun, 7.62mm, M240B",
            ui: "EA",
        },
        {
            id: 11,
            inventoryItem: "00133",
            nsn: "1005-01-127-7509",
            commonName: "M2 .50 Cal",
            description: "Machine Gun, Caliber .50, HB, M2",
            ui: "EA",
        },
        {
            id: 12,
            inventoryItem: "00134",
            nsn: "1010-01-033-9539",
            commonName: "M203 Grenade Launcher",
            description: "Launcher, Grenade, 40mm, M203",
            ui: "EA",
        },
        {
            id: 13,
            inventoryItem: "00135",
            nsn: "1010-01-541-4169",
            commonName: "M320 Grenade Launcher",
            description: "Launcher, Grenade, 40mm, M320",
            ui: "EA",
        },
        {
            id: 14,
            inventoryItem: "00136",
            nsn: "1340-01-413-0701",
            commonName: "Javelin Missile System",
            description: "Guided Missile System, AAWS-M, Javelin",
            ui: "EA",
        },
        {
            id: 15,
            inventoryItem: "00137",
            nsn: "1340-01-076-8078",
            commonName: "AT4",
            description: "Launcher, Rocket, 84mm, AT4",
            ui: "EA",
        },
        {
            id: 16,
            inventoryItem: "00138",
            nsn: "2350-01-519-2914",
            commonName: "M1A2 Abrams",
            description: "Tank, Combat, Full Tracked, 120mm Gun",
            ui: "EA",
        },
        {
            id: 17,
            inventoryItem: "00139",
            nsn: "2350-01-322-9529",
            commonName: "M2A3 Bradley",
            description: "Fighting Vehicle, Infantry, M2A3",
            ui: "EA",
        },
        {
            id: 18,
            inventoryItem: "00140",
            nsn: "2350-01-068-4077",
            commonName: "M113 APC",
            description: "Carrier, Personnel, Armored, M113",
            ui: "EA",
        },
        {
            id: 19,
            inventoryItem: "00141",
            nsn: "2320-01-177-9422",
            commonName: "LMTV",
            description: "Truck, Cargo, 2.5 Ton, 4x4, M1078",
            ui: "EA",
        },
        {
            id: 20,
            inventoryItem: "00142",
            nsn: "2320-01-178-8808",
            commonName: "FMTV",
            description: "Truck, Cargo, 5 Ton, 4x4, M1083",
            ui: "EA",
        },
        {
            id: 21,
            inventoryItem: "00143",
            nsn: "2320-01-107-7155",
            commonName: "M35A2 Deuce and a Half",
            description: "Truck, Cargo, 2.5 Ton, 6x6",
            ui: "EA",
        },
        {
            id: 22,
            inventoryItem: "00144",
            nsn: "2320-01-360-1898",
            commonName: "HEMTT",
            description: "Truck, Heavy Expanded Mobility Tactical, 8x8",
            ui: "EA",
        },
        {
            id: 23,
            inventoryItem: "00145",
            nsn: "2310-01-472-0308",
            commonName: "M1151 HMMWV",
            description: "Up-Armored High Mobility Multipurpose Wheeled Vehicle",
            ui: "EA",
        },
        {
            id: 24,
            inventoryItem: "00146",
            nsn: "5855-01-534-5931",
            commonName: "AN/PVS-31A BNVD",
            description: "Binocular Night Vision Device",
            ui: "EA",
        },
        {
            id: 25,
            inventoryItem: "00147",
            nsn: "5855-01-629-5334",
            commonName: "ENVG-B",
            description: "Enhanced Night Vision Goggle-Binocular",
            ui: "EA",
        },
        {
            id: 26,
            inventoryItem: "00148",
            nsn: "5860-01-463-9583",
            commonName: "AN/TAS-5",
            description: "Night Sight, Crew Served Weapon",
            ui: "EA",
        },
        {
            id: 27,
            inventoryItem: "00149",
            nsn: "5820-01-451-8250",
            commonName: "AN/PRC-152",
            description: "Radio Set, Multiband, Handheld",
            ui: "EA",
        },
        {
            id: 28,
            inventoryItem: "00150",
            nsn: "5820-01-641-5702",
            commonName: "AN/PRC-158",
            description: "Radio Set, Multiband, Squad",
            ui: "EA",
        },
        {
            id: 29,
            inventoryItem: "00151",
            nsn: "5820-01-304-2031",
            commonName: "AN/VRC-90",
            description: "Radio Set, Vehicular, FM",
            ui: "EA",
        },
        {
            id: 30,
            inventoryItem: "00152",
            nsn: "5895-01-534-0792",
            commonName: "Blue Force Tracker",
            description: "Applique, Force XXI Battle Command Brigade and Below",
            ui: "EA",
        },
        {
            id: 31,
            inventoryItem: "00153",
            nsn: "6665-01-452-6475",
            commonName: "JCAD",
            description: "Joint Chemical Agent Detector",
            ui: "EA",
        },
        {
            id: 32,
            inventoryItem: "00154",
            nsn: "4240-01-371-6083",
            commonName: "M50 MOPP Mask",
            description: "Mask, Chemical-Biological, Field, M50",
            ui: "EA",
        },
        {
            id: 33,
            inventoryItem: "00155",
            nsn: "4240-01-532-8147",
            commonName: "M53A1 MOPP Mask",
            description: "Mask, Chemical-Biological, Field, M53A1",
            ui: "EA",
        },
        {
            id: 34,
            inventoryItem: "00156",
            nsn: "6910-01-553-4397",
            commonName: "MILES Laser System",
            description: "Multiple Integrated Laser Engagement System",
            ui: "SE",
        },
        {
            id: 35,
            inventoryItem: "00157",
            nsn: "1290-01-412-9527",
            commonName: "AN/PEQ-15",
            description: "Aiming Light, Infrared/Visible, Target Pointer",
            ui: "EA",
        },
        {
            id: 36,
            inventoryItem: "00158",
            nsn: "1290-01-571-1799",
            commonName: "AN/PEQ-16B",
            description: "Aiming Light with Illuminator, Infrared/Visible",
            ui: "EA",
        },
        {
            id: 37,
            inventoryItem: "00159",
            nsn: "1240-01-556-1939",
            commonName: "ACOG TA31",
            description: "Sight, Rifle Combat Optic, 4x32",
            ui: "EA",
        },
        {
            id: 38,
            inventoryItem: "00160",
            nsn: "1240-01-412-9254",
            commonName: "AN/PAS-13",
            description: "Thermal Weapon Sight, Heavy",
            ui: "EA",
        },
        {
            id: 39,
            inventoryItem: "00161",
            nsn: "6140-01-490-3899",
            commonName: "BB-2590 Battery",
            description: "Battery, Lithium Ion, Rechargeable",
            ui: "EA",
        },
        {
            id: 40,
            inventoryItem: "00162",
            nsn: "6130-01-588-3966",
            commonName: "BC-2000 Charger",
            description: "Charger, Battery, Universal, BC-2000",
            ui: "EA",
        },
        {
            id: 41,
            inventoryItem: "00163",
            nsn: "6110-01-558-0620",
            commonName: "MEP-831A Generator",
            description: "Generator Set, Tactical Quiet, 3kW",
            ui: "EA",
        },
        {
            id: 42,
            inventoryItem: "00164",
            nsn: "6110-01-560-0009",
            commonName: "MEP-832A Generator",
            description: "Generator Set, Tactical Quiet, 10kW",
            ui: "EA",
        },
        {
            id: 43,
            inventoryItem: "00165",
            nsn: "8340-01-463-5882",
            commonName: "DRASH Tent",
            description: "Shelter, Deployable Rapid Assembly",
            ui: "EA",
        },
        {
            id: 44,
            inventoryItem: "00166",
            nsn: "8340-01-368-6130",
            commonName: "GP Medium Tent",
            description: "Tent, General Purpose, Medium",
            ui: "EA",
        },
        {
            id: 45,
            inventoryItem: "00167",
            nsn: "3895-01-369-5798",
            commonName: "ROWPU",
            description: "Reverse Osmosis Water Purification Unit, 600 GPH",
            ui: "EA",
        },
        {
            id: 46,
            inventoryItem: "00168",
            nsn: "8125-01-362-6127",
            commonName: "TWRS",
            description: "Tactical Water Reservoir System, 3000 Gallon",
            ui: "EA",
        },
        {
            id: 47,
            inventoryItem: "00169",
            nsn: "2510-01-540-4651",
            commonName: "M1102 Trailer",
            description: "Trailer, Cargo, 1.5 Ton, 2-Wheel",
            ui: "EA",
        },
        {
            id: 48,
            inventoryItem: "00170",
            nsn: "2330-01-119-0622",
            commonName: "M149A2 Water Trailer",
            description: "Trailer, Tank, Water, 400 Gallon",
            ui: "EA",
        },
        {
            id: 49,
            inventoryItem: "00171",
            nsn: "4210-01-494-7686",
            commonName: "AFES",
            description: "Automatic Fire Extinguisher System",
            ui: "EA",
        },
        {
            id: 50,
            inventoryItem: "00172",
            nsn: "5430-01-537-3539",
            commonName: "HIPPO",
            description: "Water Tank, Fabric, Collapsible, 3000 Gallon",
            ui: "EA",
        },
        {
            id: 51,
            inventoryItem: "00173",
            nsn: "1095-01-459-2449",
            commonName: "M240 Cradle Mount",
            description: "Mount, Cradle, Machine Gun, Vehicular",
            ui: "EA",
        },
        {
            id: 52,
            inventoryItem: "00174",
            nsn: "1095-01-413-1872",
            commonName: "M3 Tripod",
            description: "Tripod, Machine Gun, M3",
            ui: "EA",
        },
        {
            id: 53,
            inventoryItem: "00175",
            nsn: "1015-01-143-3738",
            commonName: "MK19 Grenade Machine Gun",
            description: "Machine Gun, Grenade, 40mm, Automatic, MK19",
            ui: "EA",
        },
        {
            id: 54,
            inventoryItem: "00176",
            nsn: "5855-01-577-6438",
            commonName: "AN/PSQ-20",
            description: "Enhanced Night Vision Goggle",
            ui: "EA",
        },
        {
            id: 55,
            inventoryItem: "00177",
            nsn: "6695-01-462-5985",
            commonName: "Defense Advanced GPS Receiver",
            description: "Receiver, GPS, Defense Advanced, DAGR",
            ui: "EA",
        },
        {
            id: 56,
            inventoryItem: "00178",
            nsn: "6695-01-589-1550",
            commonName: "PLGR",
            description: "Receiver, Position Location, Precision Lightweight GPS",
            ui: "EA",
        },
        {
            id: 57,
            inventoryItem: "00179",
            nsn: "5180-01-535-3137",
            commonName: "SKEDCO",
            description: "Litter, Rescue, Flexible, SKEDCO",
            ui: "EA",
        },
    ];

    const item = MOCK_END_ITEMS.find((entry) => entry.id === Number(id));

    if (!item) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography variant="h5">Item not found</Typography>
            </Box>
        );
    }

    const pdfUrl = item.pdfUrl || "/pdfs/DET10_FWD_SHR_OCT25_FLAT.pdf";
    const imageUrl = item.imageUrl || "/radio-photo.png";
    const aac = item.aac || "N/A";
    const lastSeen = item.lastSeen || "Unknown";
    const inventoryName = item.inventoryName || item.commonName;

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
                        {inventoryName}
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
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
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
                                    {aac}
                                </Typography>
                            </Paper>
                        </Box>
                    </Box>

                    <Paper variant="outlined" sx={styles.imageCard}>
                        <Box
                            component="img"
                            src={imageUrl}
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
                    <Typography variant="body1">{lastSeen}</Typography>
                </Paper>

                <Button variant="contained" size="large" sx={styles.actionButton}>
                    Start / Open Inventory
                </Button>
            </Paper>

            <PdfModalViewer
                open={openPdf}
                onClose={() => setOpenPdf(false)}
                pdfUrl={pdfUrl}
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