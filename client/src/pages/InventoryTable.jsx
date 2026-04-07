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
  ];

  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const savedQuantities = localStorage.getItem("inventoryQuantities");

    if (savedQuantities) {
      setQuantities(JSON.parse(savedQuantities));
    }
  }, []);

  const handleQuantityChange = (id, value) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSave = () => {
    localStorage.setItem("inventoryQuantities", JSON.stringify(quantities));
    console.log("Saved quantities:", quantities);
  };

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        End Item Inventory
      </Typography>

      <TableContainer component={Paper}>
        <Table aria-label="inventory table">
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
                    inputProps={{ min: 0 }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2}>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </Box>
    </div>
  );
}

export default InventoryTable;
