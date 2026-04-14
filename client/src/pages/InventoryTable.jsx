import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  MenuItem,
} from "@mui/material";

function InventoryTable() {
  const { endItemId } = useParams();
  const navigate = useNavigate();
  const storageKey = `inventoryQuantities-${endItemId}`;

  const [items, setItems] = useState([]);
  const [inventoryData, setInventoryData] = useState({});
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
          partNumber: item.part_number || item.partNumber || "",
          displayName: item.description || item.display_name || "",
          authQty: item.auth_qty ?? item.authorized_quantity ?? "",
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
    const savedInventoryData = localStorage.getItem(storageKey);

    if (savedInventoryData) {
      setInventoryData(JSON.parse(savedInventoryData));
    } else {
      setInventoryData({});
    }
  }, [storageKey]);

  const handleQuantityChange = (id, value) => {
    const numeric = value.replace(/[^0-9]/g, "");
    setInventoryData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        onHandQty: numeric,
      },
    }));
    setCompletionWarning("");
  };

  const handleLocationChange = (id, value) => {
    setInventoryData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        location: value,
      },
    }));
  };

  const handleNeedsReplacementChange = (id, value) => {
    setInventoryData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        needsReplacement: value,
      },
    }));
  };

  const handleSave = () => {
    try {
      const stampedInventoryData = Object.fromEntries(
        Object.entries(inventoryData).map(([id, row]) => [
          id,
          {
            ...row,
            countedBy:
              row.onHandQty !== undefined ||
              row.location ||
              row.needsReplacement
                ? "Current User"
                : row.countedBy || "",
            lastCounted:
              row.onHandQty !== undefined ||
              row.location ||
              row.needsReplacement
                ? new Date().toLocaleDateString()
                : row.lastCounted || "",
          },
        ]),
      );

      setInventoryData(stampedInventoryData);
      localStorage.setItem(storageKey, JSON.stringify(stampedInventoryData));
      console.log("Saved inventory data:", stampedInventoryData);
      setSaveStatus("success");
    } catch (e) {
      setSaveStatus("error");
    } finally {
      setTimeout(() => setSaveStatus(null), 4000);
    }
  };

  const handleMarkComplete = async () => {
    if (apiError || items.length === 0) {
      setCompletionWarning(
        "Inventory records are not loaded yet, so this end item cannot be marked complete.",
      );
      return;
    }

    const hasUnfilledRows = items.some((item) => {
      const value = inventoryData[item.id]?.onHandQty;
      return value === undefined || value === "";
    });

    if (hasUnfilledRows) {
      setCompletionWarning("There are still rows that have not been counted.");
      return;
    }

    try {
      setCompletionWarning("");

      const res = await fetch(
        `http://localhost:8080/end-items/${endItemId}/complete`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      console.log("End item marked complete.");
      navigate("/equipment");
    } catch (err) {
      console.error("Failed to mark inventory complete:", err);
      setCompletionWarning(
        "Unable to mark this end item complete right now. Please try again.",
      );
    }
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
              <TableCell>Variance</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Needs Replacement</TableCell>
              <TableCell>Counted By</TableCell>
              <TableCell>Last Counted</TableCell>
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
                    value={inventoryData[item.id]?.onHandQty || ""}
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
                <TableCell>
                  {inventoryData[item.id]?.onHandQty === "" ||
                  inventoryData[item.id]?.onHandQty === undefined
                    ? ""
                    : Number(inventoryData[item.id].onHandQty) -
                      Number(item.authQty || 0)}
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    value={inventoryData[item.id]?.location || ""}
                    onChange={(e) =>
                      handleLocationChange(item.id, e.target.value)
                    }
                  />
                </TableCell>

                <TableCell>
                  <TextField
                    select
                    size="small"
                    value={inventoryData[item.id]?.needsReplacement || ""}
                    onChange={(e) =>
                      handleNeedsReplacementChange(item.id, e.target.value)
                    }
                    sx={{ minWidth: 120 }}
                  >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </TextField>
                </TableCell>

                <TableCell>{inventoryData[item.id]?.countedBy || ""}</TableCell>
                <TableCell>
                  {inventoryData[item.id]?.lastCounted || ""}
                </TableCell>
              </TableRow>
            ))}

            {!apiError && items.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} align="center">
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
