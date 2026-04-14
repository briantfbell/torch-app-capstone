import { useState, useEffect } from "react";
import IngestItems from '../components/IngestItems.jsx'
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

export default function SupplyAdminPage() {

  const [uic, setUic] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/auth/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setUic(data.user?.uic ?? ""))
      .then(setLoading(false))
      .catch((err) => console.error("Failed to load user:", err));
  }, []);

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
          <Typography>Loading Admin Console...</Typography>
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Box sx={{ minWidth: 120 }} />

          <Stack alignItems="center" spacing={0.5}>
            <Typography variant="h4" fontWeight={700}>
              Supply Admin Dashbord
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upload End-Items and Components
            </Typography>
          </Stack>

          <Chip
            label={uic ? `UIC: ${uic}` : "Loading UIC..."}
            variant="outlined"
            color="primary"
            sx={{ minWidth: 120 }}
          />
        </Stack>
      <IngestItems />
      </Stack>
    </Container>
  )
}