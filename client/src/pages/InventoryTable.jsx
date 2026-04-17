import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
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
  Select,
  FormControl,
  InputLabel
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
  const [searchParams] = useSearchParams();
  const selectedSerialId = searchParams.get("serialId");


  useEffect(() => {

    fetch(`http://localhost:8080/inventory/components/${endItemId}?serid=${selectedSerialId}`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data)

        const components = Array.isArray(data)
          ? data
          : [];

        const mappedItems = components.map((item) => ({
          serial_id: selectedSerialId,
          complete: item.seen || false,
          component_id: item.id,
          niin: item.niin,
          location: item.location || "",
          count: item.count || 0,
          ui: item.ui || "",
          h_id: item.h_id || null,
          user_id: item.user_id || "",
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

  const handleQuantityChange = (c_id, value) => {

    const numeric = value.replace(/[^0-9]/g, "");

    const itemIndex = items.findIndex(item => item.component_id === c_id);

    let tempItems = [...items]
    tempItems[itemIndex].count = numeric

    setItems(tempItems)

  };

  const handleLocationChange = (c_id, value) => {

    const itemIndex = items.findIndex(item => item.component_id === c_id);

    let tempItems = [...items]
    tempItems[itemIndex].location = value

    setItems(tempItems)

  };


  const handleSeenChange = (c_id) => {

    const itemIndex = items.findIndex(item => item.component_id === c_id);
    if ( items[itemIndex].complete === false ) {
      let tempItems = [...items]
      tempItems[itemIndex].complete = true

      setItems(tempItems)

    } else {
      let tempItems = [...items]
      tempItems[itemIndex].complete = false

      setItems(tempItems)

    };
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:8080/inventory/update`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(items),
      });

      if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

    } catch (e) {
      console.error('Error during POST:', e);

    } finally {
      setTimeout(() => setSaveStatus(null), 4000);
    }
  };

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Component Inventory
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
              <TableCell>UI</TableCell>
              <TableCell>NIIN</TableCell>
              <TableCell>Display Name</TableCell>
              <TableCell>Authorized Qty</TableCell>
              <TableCell>On Hand Qty</TableCell>
              <TableCell>Variance</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Complete</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>

            {items.map((item) => (

              <TableRow key={item.component_id}>
                <TableCell>{item.ui}</TableCell>
                <TableCell>{item.niin}</TableCell>
                <TableCell>{item.displayName}</TableCell>
                <TableCell>{item.authQty}</TableCell>

                <TableCell>
                  <TextField
                    type="number"
                    size="small"
                    value={item.count}
                    onChange={(e) =>
                      handleQuantityChange(item.component_id, e.target.value)
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
                  {inventoryData[item.component_id]?.onHandQty === "" ||
                  inventoryData[item.component_id]?.onHandQty === undefined
                    ? ""
                    : Number(inventoryData[item.component_id].onHandQty) -
                      Number(item.authQty || 0)}
                </TableCell>

                <TableCell>
                  <TextField
                    size="small"
                    value={item.location || ""}
                    onChange={(e) =>
                      handleLocationChange(item.component_id, e.target.value)
                    }
                  />
                </TableCell>

                <TableCell>
                  <FormControl >
                    <Button
                      variant="contained"
                      onClick={() => handleSeenChange(item.component_id)}
                      sx={{ minWidth: 10 }}
                    >
                      <MenuItem value={true}>o</MenuItem>
                    </Button>
                  </FormControl>
                </TableCell>

                <TableCell>{JSON.stringify(item.complete)}</TableCell>

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
