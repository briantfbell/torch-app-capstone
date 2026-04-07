// EquipmentPage.jsx
// This is the main equipment page for TORCH
// Shows all end items for a unit, lets you click on them to go to a detail page
// TODO: hook up to real database later (see notes below)

import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

// PDF icon for the Sub Hand Receipt button
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

// ============================================================
// FAKE DATA - REMOVE THIS WHEN WE GET THE DATABASE WORKING
// ============================================================
// Each object here is one piece of equipment (an "end item")
// When the backend is ready, delete this block and use the
// useEffect fetch commented out inside EquipmentPage() below
//
// HOW TO ADD MORE FAKE ITEMS FOR TESTING:
//   Copy any object below, paste at the bottom of the array,
//   increment the id by 1, and fill in the real values
//
// FIELD EXPLANATIONS:
//   id            - unique number per item (db handles this automatically later)
//   inventoryItem - hand receipt line number or inventory control number
//   nsn           - National Stock Number, always formatted ####-##-###-####
//   commonName    - what people actually call it day to day
//   description   - official army description from the MTOE/property book
//   ui            - Unit of Issue (how the item is counted on the 2062)
//                   we itemize everything as EA (Each) for exact accountability
//                   but here are the other codes in case they come up:
//                     AM=Ampoule  AY=Assembly  BG=Bag      BX=Box
//                     CA=Cartridge CN=Can      CS=Case     CT=Carton
//                     DR=Drum     DZ=Dozen     EA=Each     GL=Gallon
//                     KT=Kit      LB=Pound     LT=Lot      MR=Meter
//                     OZ=Ounce    PK=Package   PR=Pair     RL=Reel
//                     RM=Ream     SE=Set       SH=Sheet    TU=Tube
//                     PLC=PLACEHOLDER
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
];
// ============================================================
// END FAKE DATA
// ============================================================

// Bordered label box, used for the "END ITEMS" section header
// Made it its own component so we can reuse it elsewhere if needed
// "children" is just whatever text you put between the tags when you use it
function SectionLabel({ children }) {
  return (
    <Box sx={styles.sectionLabel}>
      <Typography variant="subtitle1" fontWeight={600} letterSpacing={1}>
        {children}
      </Typography>
    </Box>
  );
}

// One clickable row in the equipment list
// Props:
//   item     - the equipment object (id, nsn, commonName, etc.)
//   onClick  - function to call when the row is clicked
//   selected - true/false, whether this row is highlighted
function EndItemRow({ item, onClick, selected }) {
  return (
    <ListItemButton
      onClick={() => onClick(item)}
      selected={selected}
      sx={selected ? styles.rowSelected : styles.row}
    >
      <ListItemText
        primary={
          // TO ADD MORE FIELDS TO THE ROW:
          // Copy a Typography block below, change item.fieldName to your new field
          // Also make sure that field exists in the data object above
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

// ============================================================
// MAIN PAGE COMPONENT
// ============================================================
// Props:
//   uic - Unit Identification Code from the login/auth system
//         defaulting to "W4MOCK" so the page doesnt crash before auth is built
//         TODO: remove the default once auth is wired up
export default function EquipmentPage({ uic = "W4MOCK" }) {
  const navigate = useNavigate();

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
    navigate("/equipment/sub-hand-receipt");
  };

  return (
    <>
      <div>
        <h1>Equipment</h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
          }}
        >
          <button onClick={() => navigate("/shr-viewer")}>
            Sub Hand Receipt PDF
          </button>
        </div>
      </div>

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

  // top row with "Equipment" and UIC chip
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },

  // horizontal rule under the header
  divider: {
    width: "100%",
  },

  // Sub Hand Receipt PDF button
  pdfButton: {
    width: "100%",
    py: 1.5,
  },

  // bordered box used for section labels like "END ITEMS"
  sectionLabel: {
    border: "1px solid",
    borderColor: "grey.400",
    borderRadius: 1,
    px: 3,
    py: 1,
    textAlign: "center",
    width: "100%",
  },

  // scrollable container for the equipment list
  // change maxHeight if the list needs to be taller or shorter
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

  // default (unselected) equipment row
  row: {
    border: "1px solid",
    borderColor: "grey.400",
    borderRadius: 1,
    mb: 1,
    backgroundColor: "background.paper",
    "&:hover": { backgroundColor: "action.hover" },
  },

  // selected equipment row (after user clicks it)
  rowSelected: {
    border: "1px solid",
    borderColor: "primary.main",
    borderRadius: 1,
    mb: 1,
    backgroundColor: "primary.light",
    "&:hover": { backgroundColor: "action.hover" },
  },

  // flex row inside each equipment row
  rowContent: {
    display: "flex",
    gap: 2,
    flexWrap: "wrap",
    alignItems: "center",
  },

  // Item # field
  rowField: {
    minWidth: 80,
  },

  // NSN field (needs more space because NSNs are long)
  rowFieldWide: {
    minWidth: 160,
  },

  // Common Name field
  rowFieldMed: {
    minWidth: 120,
  },

  // Description field (takes up remaining space)
  rowFieldFlex: {
    flex: 1,
  },
};
