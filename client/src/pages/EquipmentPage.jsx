// EquipmentPage.jsx
// This is the main equipment page for TORCH
// Shows all end items for a unit, lets you click on them to go to a detail page
// TODO: hook up to real database later (see notes below)
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

import {
    Box,
    Typography,
    Button,
    List,
    ListItemButton,
    ListItemText,
    Divider,
    Chip,
} from "@mui/material";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

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
];

function SectionLabel({ children }) {
    return (
        <Box sx={styles.sectionLabel}>
            <Typography variant="subtitle1" fontWeight={600} letterSpacing={1}>
                {children}
            </Typography>
        </Box>
    );
}

function EndItemRow({ item, onClick, selected }) {
    return (
        <ListItemButton
            onClick={() => onClick(item)}
            selected={selected}
            sx={selected ? styles.rowSelected : styles.row}
        >
            <ListItemText
                primary={
                    <Box sx={styles.rowContent}>
                        <Typography variant="body2" sx={styles.rowField}>
                            <b>Item #:</b> {item.inventoryItem}
                        </Typography>
                        <Typography variant="body2" sx={styles.rowFieldWide}>
                            <b>NSN:</b> {item.nsn}
                        </Typography>
                        <Typography variant="body2" sx={styles.rowFieldMed}>
                            <b>Name:</b> {item.commonName}
                        </Typography>
                        <Typography variant="body2" sx={styles.rowFieldFlex}>
                            <b>Desc:</b> {item.description}
                        </Typography>
                        <Chip label={item.ui} size="small" variant="outlined" />
                    </Box>
                }
            />
        </ListItemButton>
    );
}

export default function EquipmentPage({ uic = "W4MOCK" }) {
  const navigate = useNavigate();

    const { id } = useParams()
    const { user } = useAuth()

    if (user && user.uic !== id) {
    return <div>Access Denied</div>
    }

  // tracks which row the user last clicked so we can highlight it
  // starts as null (nothing selected)
  const [selectedItem, setSelectedItem] = useState(null);

  // ============================================================
  // TODO: REPLACE MOCK DATA WITH REAL DATABASE FETCH
  // ============================================================
  // When the backend API is ready:
  //   1. Delete the MOCK_END_ITEMS array at the top of this file
  //   2. Add these two state variables up above:
  //        const [endItems, setEndItems] = useState([]);
  //        const [loading, setLoading] = useState(true);
  //   3. Uncomment the useEffect block below
  //   4. Replace MOCK_END_ITEMS in the List below with endItems
  //
  // useEffect(() => {
  //   fetch(`/api/equipment?uic=${uic}`)      // calls the backend route
  //     .then((res) => res.json())             // parses the response as JSON
  //     .then((data) => {
  //       setEndItems(data);                   // saves the items into state
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.error("Failed to load equipment:", err);
  //       setLoading(false);
  //     });
  // }, [uic]); // reruns if the uic prop ever changes
  // ============================================================

  // called when a row is clicked
  const handleItemClick = (item) => {
    setSelectedItem(item.id);
    // goes to the detail page for this item
    // TODO: confirm this path matches the route defined in App.jsx for the detail page
    navigate(`/equipment/${item.id}`);
  };

  const handleSubHandReceipt = () => {
    // goes to the sub hand receipt page
    // TODO: confirm this path matches the route in App.jsx
    navigate("/shr-viewer");
  };

  return (
    <>
      <Box sx={styles.page}>
        {/* TOP ROW - page label left, UIC badge right */}
        <Box sx={styles.header}>
          <Typography variant="h5" fontWeight={700}>
            Equipment
          </Typography>
          <Chip label={`UIC: ${uic}`} variant="outlined" size="medium" />
        </Box>

        <Divider sx={styles.divider} />

        <Button
          variant="outlined"
          size="large"
          startIcon={<PictureAsPdfIcon />}
          onClick={handleSubHandReceipt}
          sx={styles.pdfButton}
        >
          Sub Hand Receipt PDF
        </Button>

        <SectionLabel>END ITEMS</SectionLabel>

        <Box sx={styles.scrollBox}>
          <List disablePadding>
            {MOCK_END_ITEMS.map((item) => (
              <EndItemRow
                key={item.id}
                item={item}
                onClick={handleItemClick}
                selected={selectedItem === item.id}
              />
            ))}
          </List>
        </Box>
      </Box>
    </>
  );
}

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
        width: "100%",
    },
    divider: {
        width: "100%",
    },
    pdfButton: {
        width: "100%",
        py: 1.5,
    },
    sectionLabel: {
        border: "1px solid",
        borderColor: "grey.400",
        borderRadius: 1,
        px: 3,
        py: 1,
        textAlign: "center",
        width: "100%",
    },
    scrollBox: {
        width: "100%",
        maxHeight: 420,
        overflowY: "auto",
        pr: 0.5,
        "&::-webkit-scrollbar": { width: 8 },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: "grey.400",
            borderRadius: 4,
        },
    },
    row: {
        border: "1px solid",
        borderColor: "grey.400",
        borderRadius: 1,
        mb: 1,
        backgroundColor: "background.paper",
        "&:hover": { backgroundColor: "action.hover" },
    },
    rowSelected: {
        border: "1px solid",
        borderColor: "primary.main",
        borderRadius: 1,
        mb: 1,
        backgroundColor: "primary.light",
        "&:hover": { backgroundColor: "action.hover" },
    },
    rowContent: {
        display: "flex",
        gap: 2,
        flexWrap: "wrap",
        alignItems: "center",
    },
    rowField: {
        minWidth: 80,
    },
    rowFieldWide: {
        minWidth: 160,
    },
    rowFieldMed: {
        minWidth: 120,
    },
    rowFieldFlex: {
        flex: 1,
    },
};