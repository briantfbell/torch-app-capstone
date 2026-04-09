import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  const { endItemId } = useParams();

  const [items, setItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [saveStatus, setSaveStatus] = useState(null);
  const [apiError, setApiError] = useState("");
  const [completionWarning, setCompletionWarning] = useState("");

  useEffect(() => {
    console.log("endItemId:", endItemId);
    fetch(`http://localhost:8080/components?end_item_id=${endItemId}`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("API data:", data);

        const components = Array.isArray(data.allComponents)
          ? data.allComponents
          : [];

        const mappedItems = components.map((item) => ({
          id: item.id,
          niin: item.niin,
          partNumber: item.part_number || "",
          displayName: item.description || "",
          authQty: item.auth_qty ?? "",
        }));

        setItems(mappedItems);
        setApiError("");
      })
      .catch((err) => {
        console.error("Failed to fetch inventory:", err);
        setItems([]);
        setApiError("Failed to load inventory data. Please try again.");
      });
  }, [endItemId]);

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
    setCompletionWarning("");
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

  const handleMarkComplete = () => {
    if (apiError || items.length === 0) {
      setCompletionWarning(
        "Inventory records are not loaded yet, so this end item cannot be marked complete.",
      );
      return;
    }

    const hasUnfilledRows = items.some((item) => {
      const value = quantities[item.id];
      return value === undefined || value === "";
    });

    if (hasUnfilledRows) {
      setCompletionWarning("There are still rows that have not been counted.");
      return;
    }

    setCompletionWarning("");
    console.log("All rows filled. Ready to mark inventory complete.");
  };

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        End Item Inventory
      </Typography>

      {apiError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {apiError}
        </Alert>
      )}

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

            {!apiError && items.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No inventory records available yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2} display="flex" flexDirection="column" gap={1}>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>

        <Button
          variant="contained"
          color="success"
          onClick={handleMarkComplete}
        >
          Mark Complete
        </Button>

        {saveStatus === "success" && (
          <Alert severity="success">Inventory saved successfully.</Alert>
        )}
        {saveStatus === "error" && (
          <Alert severity="error">
            Failed to save inventory. Please try again.
          </Alert>
        )}
        {completionWarning && (
          <Alert severity="warning">{completionWarning}</Alert>
        )}
      </Box>
    </div>
  );
}

export default InventoryTable;
