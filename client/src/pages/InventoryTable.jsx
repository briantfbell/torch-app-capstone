import { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";

function InventoryTable() {
  const items = [
    {
      id: 1,
      niin: "001234567",
      partNumber: "123-ABC",
      displayName: "Cable Assembly",
      authQty: 5,
    },
    {
      id: 2,
      niin: "008765432",
      partNumber: "456-DEF",
      displayName: "Adapter Tool",
      authQty: 2,
    },
    {
      id: 3,
      niin: "003456789",
      partNumber: "789-GHI",
      displayName: "Power Supply Unit",
      authQty: 10,
    },
    {
      id: 4,
      niin: "004567890",
      partNumber: "012-JKL",
      displayName: "Filter Element",
      authQty: 8,
    },
    {
      id: 5,
      niin: "005678901",
      partNumber: "345-MNO",
      displayName: "Connector Block",
      authQty: 3,
    },
    {
      id: 6,
      niin: "006789012",
      partNumber: "678-PQR",
      displayName: "Circuit Breaker",
      authQty: 6,
    },
    {
      id: 7,
      niin: "007890123",
      partNumber: "901-STU",
      displayName: "Valve Assembly",
      authQty: 4,
    },
    {
      id: 8,
      niin: "008901234",
      partNumber: "234-VWX",
      displayName: "Sensor Module",
      authQty: 12,
    },
    {
      id: 9,
      niin: "009012345",
      partNumber: "567-YZA",
      displayName: "Relay Switch",
      authQty: 7,
    },
    {
      id: 10,
      niin: "010123456",
      partNumber: "890-BCD",
      displayName: "Mounting Bracket",
      authQty: 15,
    },
    {
      id: 11,
      niin: "011234567",
      partNumber: "111-EFG",
      displayName: "Fuel Pump",
      authQty: 2,
    },
    {
      id: 12,
      niin: "012345678",
      partNumber: "222-HIJ",
      displayName: "Hydraulic Hose",
      authQty: 9,
    },
    {
      id: 13,
      niin: "013456789",
      partNumber: "333-KLM",
      displayName: "Gear Shaft",
      authQty: 1,
    },
    {
      id: 14,
      niin: "014567890",
      partNumber: "444-NOP",
      displayName: "Control Panel",
      authQty: 3,
    },
    {
      id: 15,
      niin: "015678901",
      partNumber: "555-QRS",
      displayName: "Drive Belt",
      authQty: 20,
    },
    {
      id: 16,
      niin: "016789012",
      partNumber: "666-TUV",
      displayName: "Exhaust Manifold",
      authQty: 4,
    },
    {
      id: 17,
      niin: "017890123",
      partNumber: "777-WXY",
      displayName: "Bearing Assembly",
      authQty: 6,
    },
    {
      id: 18,
      niin: "018901234",
      partNumber: "888-ZAB",
      displayName: "Pressure Regulator",
      authQty: 5,
    },
    {
      id: 19,
      niin: "019012345",
      partNumber: "999-CDE",
      displayName: "Ignition Coil",
      authQty: 8,
    },
    {
      id: 20,
      niin: "020123456",
      partNumber: "000-FGH",
      displayName: "Thermal Fuse",
      authQty: 11,
    },
  ];

  const [quantities, setQuantities] = useState({});
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null

  useEffect(() => {
    const savedQuantities = localStorage.getItem("inventoryQuantities");

    if (savedQuantities) {
      setQuantities(JSON.parse(savedQuantities));
    }
  }, []);

  const handleQuantityChange = (id, value) => {
    const numeric = value.replace(/[^0-9]/g, "");
    setQuantities((prev) => ({
      ...prev,
      [id]: numeric,
    }));
  };

  const handleSave = () => {
    try {
      localStorage.setItem("inventoryQuantities", JSON.stringify(quantities));
      console.log("Saved quantities:", quantities);
      setSaveStatus("success");
    } catch (e) {
      setSaveStatus("error");
    } finally {
      setTimeout(() => setSaveStatus(null), 4000);
    }
  };

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        End Item Inventory
      </Typography>

      <TableContainer component={Paper} sx={{ maxHeight: 750 }}>
        <Table stickyHeader aria-label="inventory table">
          <TableHead>
            <TableRow>
              <TableCell>NIIN</TableCell>
              <TableCell>Part Number</TableCell>
              <TableCell>Display Name</TableCell>
              <TableCell>Authorized Qty</TableCell>
              <TableCell>On Hand Qty</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.niin}</TableCell>
                <TableCell>{item.partNumber}</TableCell>
                <TableCell>{item.displayName}</TableCell>
                <TableCell>{item.authQty}</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    size="small"
                    value={quantities[item.id] || ""}
                    onChange={(e) =>
                      handleQuantityChange(item.id, e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (["e", "E", "+", "-", "."].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    inputProps={{ min: 0 }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2} display="flex" flexDirection="column" gap={1}>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>

        {saveStatus === "success" && (
          <Alert severity="success">Inventory saved successfully.</Alert>
        )}
        {saveStatus === "error" && (
          <Alert severity="error">
            Failed to save inventory. Please try again.
          </Alert>
        )}
      </Box>
    </div>
  );
}

export default InventoryTable;
