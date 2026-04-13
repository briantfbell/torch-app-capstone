import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

function EndItemRow({ item, onClick, selected }) {
  return (
    <ListItemButton
      onClick={() => onClick(item)}
      selected={selected}
      sx={{
        border: "1px solid",
        borderColor: selected ? "primary.main" : "grey.400",
        borderRadius: 1,
        mb: 1,
        backgroundColor: selected ? "primary.light" : "background.paper",
        "&:hover": { backgroundColor: "action.hover" },
      }}
    >
      <ListItemText
        primary={
          <Stack direction="row" gap={2} flexWrap="wrap" alignItems="center">
            <Typography variant="body2" sx={{ minWidth: 80 }}>
              <b>LIN:</b> {item.lin}
            </Typography>
            <Typography variant="body2" sx={{ minWidth: 160 }}>
              <b>NIIN:</b> {item.niin}
            </Typography>
            <Typography variant="body2" sx={{ minWidth: 120 }}>
              <b>FSC:</b> {item.fsc}
            </Typography>
            <Typography variant="body2" sx={{ flex: 1 }}>
              <b>Desc:</b> {item.description}
            </Typography>
            <Chip
              label={`Auth Qty: ${item.auth_qty}`}
              size="small"
              variant="outlined"
            />
          </Stack>
        }
      />
    </ListItemButton>
  );
}

export default function EquipmentPage() {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);
  const [endItems, setEndItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uic, setUic] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/auth/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setUic(data.user?.uic ?? ""))
      .catch((err) => console.error("Failed to load user:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/end-items", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setEndItems(data.allEndItems ?? []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load equipment:", err);
        setLoading(false);
      });
  }, []);

  const handleItemClick = (item) => {
    setSelectedItem(item.id);
    navigate(`/equipment/${item.id}`);
  };

  const handleSubHandReceipt = () => {
    navigate("/equipment/shr-viewer");
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack
          spacing={2}
          alignItems="center"
          justifyContent="center"
          sx={{ minHeight: "60vh" }}
        >
          <CircularProgress />
          <Typography>Loading equipment...</Typography>
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        {/* Header row */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Box sx={{ minWidth: 120 }} />

          <Stack alignItems="center" spacing={0.5}>
            <Typography variant="h4" fontWeight={700}>
              Equipment
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Unit property and end item list
            </Typography>
          </Stack>

          <Chip
            label={uic ? `UIC: ${uic}` : "Loading..."}
            variant="outlined"
            color="primary"
            sx={{ minWidth: 120 }}
          />
        </Stack>

        <Divider />

        {/* Sub Hand Receipt button */}
        <Button
          variant="outlined"
          size="large"
          startIcon={<PictureAsPdfIcon />}
          onClick={handleSubHandReceipt}
          sx={{ alignSelf: "center", minWidth: 320 }}
        >
          Sub Hand Receipt PDF
        </Button>

        {/* End Items section */}
        <Card variant="outlined">
          <CardContent>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              gutterBottom
              letterSpacing={1}
            >
              END ITEMS
            </Typography>

            <Stack
              sx={{
                maxHeight: 700,
                overflowY: "auto",
                pr: 0.5,
                "&::-webkit-scrollbar": { width: 8 },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "grey.400",
                  borderRadius: 4,
                },
              }}
            >
              {endItems.length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "center", py: 4 }}
                >
                  No equipment found.
                </Typography>
              ) : (
                <List disablePadding>
                  {endItems.map((item) => (
                    <EndItemRow
                      key={item.id}
                      item={item}
                      onClick={handleItemClick}
                      selected={selectedItem === item.id}
                    />
                  ))}
                </List>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
