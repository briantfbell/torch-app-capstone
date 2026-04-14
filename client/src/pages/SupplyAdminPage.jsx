import {
  Chip,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import IngestItems from '../components/IngestItems.jsx';
import { useAuth } from '../hooks/useAuth.jsx';

export default function SupplyAdminPage() {
  const { user, loading: authLoading } = useAuth();
  const [uics, setUics] = useState([]);
  const [selectedUic, setSelectedUic] = useState(null);

  const isAdmin = user?.role?.includes('admin');

  // selectedUic is null until the admin explicitly picks one;
  // fall back to the logged-in user's own UIC until then
  const effectiveUic = selectedUic ?? user?.uic ?? null;

  useEffect(() => {
    if (!isAdmin) return;

    fetch('http://localhost:8080/uics', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setUics(data.allUics.map(i => i.uic)))
      .catch(err => console.error('Failed to get UICs:', err));
  }, [isAdmin]);

  if (authLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack
          spacing={2}
          alignItems="center"
          justifyContent="center"
          sx={{ minHeight: '60vh' }}
        >
          <CircularProgress />
          <Typography>Loading Admin Console...</Typography>
        </Stack>
      </Container>
    );
  }

  return (
    <Stack
      maxWidth="lg"
      sx={{ py: 4 }}
      alignItems="center"
      justifyContent="center"
    >
      <Stack spacing={3} alignItems="center" justifyContent="center">
        <Grid
          container
          spacing={2}
          sx={{
            flexDirection: { xs: 'column', sm: 'row' },
          }}
          alignItems="center"
          justifyContent="center"
        >
          <Grid size={1}></Grid>

          <Grid size={10} spacing={0.5}>
            <Typography variant="h4" fontWeight={700} textAlign="center">
              Supply Admin Dashboard
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              Upload CSV, XLSX, or XLS files
            </Typography>
          </Grid>

          <Grid
            size={1}
            alignSelf="center"
            justifySelf="center"
            sx={{
              display: 'flex',
              justifyContent: { xs: 'center', sm: 'flex-start' },
            }}
          >
            {isAdmin ? (
              <FormControl style={{ width: '12rem' }}>
                <InputLabel id="select-label">Select a UIC</InputLabel>

                <Select
                  labelId="select-label"
                  id="select"
                  value={effectiveUic ?? ''}
                  label="Select a UIC"
                  onChange={e => setSelectedUic(e.target.value)}
                >
                  {uics.map(u => (
                    <MenuItem key={u} value={u}>
                      {u}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <Chip
                label={user?.uic ? `UIC: ${user.uic}` : 'No UIC assigned'}
                variant="outlined"
                color="primary"
                sx={{ minWidth: 120 }}
              />
            )}
          </Grid>
        </Grid>

        <IngestItems uic={effectiveUic} />
      </Stack>
    </Stack>
  );
}
