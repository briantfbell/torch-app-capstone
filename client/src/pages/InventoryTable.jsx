import {useEffect, useMemo, useState} from "react";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const cardSx = {
  borderRadius: 4,
  border: "1px solid",
  borderColor: "divider",
};

const SectionHeader = ({ title, description }) => (
  <Stack spacing={0.75}>
    <Typography variant="h6" fontWeight={700}>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {description}
    </Typography>
  </Stack>
);

function InventoryTable() {
  const { endItemId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedSerialId = searchParams.get("serialId");

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState(null);
  const [apiError, setApiError] = useState("");
  const [completionWarning, setCompletionWarning] = useState("");

  useEffect(() => {
    setLoading(true);

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
        const components = Array.isArray(data) ? data : [];

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
      })
      .finally(() => setLoading(false));
  }, [endItemId, selectedSerialId]);

  const completedCount = items.filter((item) => item.complete).length;
  const totalAuthorized = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.authQty || 0), 0),
    [items],
  );
  const totalOnHand = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.count || 0), 0),
    [items],
  );

  const updateItem = (componentId, updater) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.component_id === componentId ? updater(item) : item,
      ),
    );
  };

  const handleQuantityChange = (componentId, value) => {
    updateItem(componentId, (item) => ({
      ...item,
      count: value < 0 ? 0 : value,
    }));
  };

  const handleLocationChange = (componentId, value) => {
    updateItem(componentId, (item) => ({
      ...item,
      location: value,
    }));
  };

  const handleSeenChange = (componentId) => {
    updateItem(componentId, (item) => ({
      ...item,
      complete: !item.complete,
    }));
  };



  const handleSave = async () => {
    const incompleteCount = items.filter((item) => !item.complete).length;

    if (incompleteCount > 0) {
      setCompletionWarning(
        `${incompleteCount} component${incompleteCount === 1 ? "" : "s"} still marked incomplete.`,
      );
    } else {
      setCompletionWarning("");
    }

    try {
      const response = await fetch("http://localhost:8080/inventory/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(items),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();
      setSaveStatus("success");
    } catch (e) {
      console.error("Error during POST:", e);
      setSaveStatus("error");
    } finally {
      setTimeout(() => setSaveStatus(null), 4000);
    }
  };

  if (loading) {
    return (
      <Box sx={{ maxWidth: 1500, mx: "auto", width: "100%", py: 4 }}>
        <Stack
          spacing={2}
          alignItems="center"
          justifyContent="center"
          sx={{ minHeight: "60vh" }}
        >
          <CircularProgress />
          <Typography>Loading component inventory...</Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1500, mx: "auto", width: "100%" }}>
      <Stack spacing={3}>
        <Card elevation={0} sx={cardSx}>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Stack spacing={3}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={2}
              >
                <Stack spacing={1}>
                  <Typography variant="overline" color="primary" fontWeight={700}>
                    Component Inventory
                  </Typography>
                  <Typography variant="h4" fontWeight={800}>
                    Inventory Table
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Review authorized quantities, record on-hand counts, and mark each component complete.
                  </Typography>
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                  <Chip
                    label={`Components: ${items.length}`}
                    variant="outlined"
                    color="primary"
                  />
                  <Chip
                    label={`Complete: ${completedCount}/${items.length}`}
                    variant="outlined"
                    color={items.length > 0 && completedCount === items.length ? "success" : "default"}
                  />
                </Stack>
              </Stack>


              {apiError && <Alert severity="warning">{apiError}</Alert>}
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
            </Stack>
          </CardContent>
        </Card>

        <Card elevation={0} sx={cardSx}>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Stack spacing={3}>
              <SectionHeader
                title="Inventory Overview"
                description="Update counts and locations directly in the table. Variance is calculated from on-hand quantity minus authorized quantity."
              />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1} useFlexGap flexWrap="wrap">
                <Chip label={`Authorized Total: ${totalAuthorized}`} color="primary" variant="outlined" />
                <Chip label={`On Hand Total: ${totalOnHand}`} color="primary" variant="outlined" />
                <Chip
                  label={`Outstanding: ${items.length - completedCount}`}
                  color={items.length - completedCount === 0 ? "success" : "default"}
                  variant="outlined"
                />
              </Stack>

              <Divider />

              <TableContainer>
                <Table stickyHeader aria-label="inventory table">
                  <TableHead>
                    <TableRow>
                      <TableCell>UI</TableCell>
                      <TableCell>NIIN</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell align="left">Authorized</TableCell>
                      <TableCell align="center" sx={{width: 200}}>On Hand</TableCell>
                      <TableCell align="right">Variance</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {items.map((item) => {
                      const variance =
                        item.count === "" ? "" : Number(item.count || 0) - Number(item.authQty || 0);

                      let onHandCount = item.count;


                      return (
                        <TableRow key={item.component_id} hover>
                          <TableCell>{item.ui || "N/A"}</TableCell>
                          <TableCell>{item.niin || "N/A"}</TableCell>
                          <TableCell>{item.displayName || "Unnamed component"}</TableCell>
                          <TableCell align="left"><Chip variant={'outlined'} color={'primary'} label={item.authQty || 0} sx={{width: 40, height: 40, borderRadius: '100%'}}/></TableCell>

                          <TableCell align="right" sx={{ minWidth: 120 }}>
                            <Stack direction={'row'} spacing={1} justifyContent={'end'}>
                            <Button size={'small'} variant={'outlined'} sx={{borderRadius: '100%', minWidth: 40, minHeight: 40}}   onClick={() => handleQuantityChange(item.component_id, onHandCount - 1)}><RemoveIcon sx={{fontSize: 14}}/></Button>
                            <TextField
                              type="number"
                              size="small"
                              value={onHandCount}
                              onChange={(e) => handleQuantityChange(item.component_id, e.target.value)}
                              inputProps={{ min: 0 }}
                              sx={{width: '100%'}}
                            />
                            <Button size={'small'} variant={'outlined'} sx={{borderRadius: '100%', minWidth: 40, minHeight: 40}}  onClick={() => handleQuantityChange(item.component_id, onHandCount + 1)}><AddIcon sx={{fontSize: 14}}/></Button>
                            </Stack>
                          </TableCell>

                          <TableCell align="right">
                            {variance === "" ? (
                              "-"
                            ) : (
                              <Chip
                                label={variance > 0 ? `+${variance}` : `${variance}`}
                                color={variance === 0 ? "success" : variance < 0 ? "error" : "primary"}
                                variant={variance === 0 ? "filled" : "outlined"}
                                sx={{width: 40, height: 40, borderRadius: '100%'}}
                              />
                            )}
                          </TableCell>

                          <TableCell sx={{ minWidth: 180 }}>
                            <TextField
                              size="small"
                              value={item.location}
                              onChange={(e) => handleLocationChange(item.component_id, e.target.value)}
                              placeholder="Storage location"
                              fullWidth
                            />
                          </TableCell>

                          <TableCell sx={{ minWidth: 150 }}>
                            <Button
                              variant={item.complete ? "contained" : "outlined"}
                              color={item.complete ? "success" : "primary"}
                              startIcon={
                                item.complete ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />
                              }
                              onClick={() => handleSeenChange(item.component_id)}
                            >
                              Complete
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}

                    {!apiError && items.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          No inventory records available yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
                Save Inventory
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}

export default InventoryTable;
