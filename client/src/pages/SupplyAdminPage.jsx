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
  const isAdmin = user?.role?.includes('admin');
  const [adminSelectedUic, setAdminSelectedUic] = useState(null);
  const selectedUic = isAdmin
    ? adminSelectedUic
    : user?.uic_id
      ? { uicId: user.uic_id, uicName: user.uic }
      : null;

  useEffect(() => {
    if (!isAdmin) return;

    fetch('http://localhost:8080/uics', { credentials: 'include' })
      .then(res => res.json())
      .then(data =>
        setUics(data.allUics.map(i => ({ uicId: i.id, uicName: i.uic }))),
      )
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
      alignSelf="center"
      justifySelf="center"
    >
      <Stack spacing={3} alignItems="center" justifyContent="center">
        <Grid
          container
          spacing={2}
          sx={{
            flexDirection: { xs: 'column', sm: 'row' },
            width: { xs: '30rem', sm: '50rem' },
          }}
          alignItems="center"
          justifyContent="center"
        >
          <Grid
            size={{ xs: 0, sm: 2.5 }}
            sx={{ display: { xs: 'none', sm: 'block' } }}
          ></Grid>

          <Grid size={{ xs: 12, sm: 7 }} spacing={0.5}>
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
            size={{ xs: 12, sm: 2.5 }}
            sx={{
              display: 'flex',
              justifyContent: { xs: 'center', sm: 'flex-start' },
            }}
          >
            {isAdmin ? (
              <FormControl sx={{ minWidth: '9rem' }}>
                <InputLabel id="select-label">Select a UIC</InputLabel>

                <Select
                  labelId="select-label"
                  id="select"
                  value={selectedUic?.uicId ?? ''}
                  label=""
                  onChange={e =>
                    setAdminSelectedUic(
                      uics.find(u => u.uicId === e.target.value),
                    )
                  }
                >
                  {uics.map(u => (
                    <MenuItem key={u.uicId} value={u.uicId}>
                      {u.uicName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <Chip
                label={user?.uic ? `UIC: ${user.uic}` : 'No UIC assigned'}
                variant="outlined"
                color="primary"
              />
            )}
          </Grid>
        </Grid>

        <IngestItems uic={selectedUic} />
      </Stack>
    </Stack>
  );
}
