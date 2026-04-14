import {
  Box,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import IngestItems from '../components/IngestItems.jsx';

export default function SupplyAdminPage() {
  const [userUic, setUserUic] = useState(null);
  const [userRoles, setUserRoles] = useState(null);
  const [uics, setUics] = useState([]);
  const [selectedUic, setSelectedUic] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log(uics, userUic, selectedUic, userRoles);

  useEffect(() => {
    const fetchData = async () => {
      const getUserInfo = fetch('http://localhost:8080/auth/me', {
        credentials: 'include',
      })
        .then(res => res.json())
        .then(data => {
          setUserUic(data.user?.uic ?? '');
          setUserRoles(data.user?.role ?? []);
          setSelectedUic(userUic);
        })
        .then(() => setLoading(false))
        .catch(err => console.error('Failed to load user:', err));

      let uicArray = [];

      const getUics = fetch('http://localhost:8080/uics', {
        credentials: 'include',
      })
        .then(res => res.json())
        .then(data => data.allUics.map(i => uicArray.push(i.uic)))
        .then(() => setUics(uicArray))
        .catch(err => console.error('Failed to get UICs:', err));

      await Promise.all([getUserInfo, getUics]);
    };

    fetchData();
  }, [userUic]);

  if (loading) {
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Box sx={{ minWidth: 120 }} />

          <Stack alignItems="center" spacing={0.5}>
            <Typography variant="h4" fontWeight={700}>
              Supply Admin Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upload CSV, XLSX, or XLS files
            </Typography>
          </Stack>

          {userRoles.includes('admin') ? (
            <FormControl style={{ width: '12rem' }}>
              <InputLabel id="select-label">Select a UIC</InputLabel>

              <Select
                labelId="select-label"
                id="select"
                value={selectedUic}
                label=""
                // onChange={handleUicChange}
              >
                {uics.map(u => {
                  <MenuItem
                    variant="outlined"
                    color="primary"
                    value={u}
                    sx={{ minWidth: 120 }}
                    onClick={() => setSelectedUic(u)}
                  >
                    {u}
                  </MenuItem>;
                })}
              </Select>
            </FormControl>
          ) : (
            <Chip
              label={userUic ? `UIC: ${userUic}` : 'Loading UIC...'}
              variant="outlined"
              color="primary"
              sx={{ minWidth: 120 }}
            />
          )}
        </Stack>
        <IngestItems />
      </Stack>
    </Container>
  );
}
