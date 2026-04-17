import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import {useEffect, useState} from 'react';
import IngestItems from '../components/IngestItems.jsx';
import {useAuth} from '../hooks/useAuth.jsx';

export default function SupplyAdminPage() {
  const { user, loading: authLoading } = useAuth();
  const [uics, setUics] = useState([]);
  const isAdmin = user?.role?.includes('admin');
  const [adminSelectedUic, setAdminSelectedUic] = useState(null);

  useEffect(() => {
    if (user?.uic_id && adminSelectedUic === null) {
      setAdminSelectedUic({ uicId: user.uic_id, uicName: user.uic });
    }
  }, [user]);

  useEffect(() => {
    if (!isAdmin) return;

    fetch('http://localhost:8080/uics', { credentials: 'include' })
      .then(res => res.json())
      .then(data =>
        setUics(data.allUics.map(i => ({ uicId: i.id, uicName: i.uic }))),
      )
      .catch(err => console.error('Failed to get UICs:', err));
  }, [isAdmin]);

  const selectedUic = isAdmin
    ? adminSelectedUic
    : user?.uic_id
      ? { uicId: user.uic_id, uicName: user.uic }
      : null;

  if (authLoading) {
    return (
      <Box sx={{ mx: 'auto', width: '100%', py: 4 }}>
        <Stack
          spacing={2}
          alignItems="center"
          justifyContent="center"
          sx={{ minHeight: '60vh' }}
        >
          <CircularProgress />
          <Typography>Loading Admin Console...</Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{maxWidth: 1500, mx: 'auto', width: '100%'}}>
      <Stack spacing={3}>
        <Card
          elevation={0}
          sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider' }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Stack spacing={3}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                spacing={2}
              >
                <Stack spacing={1}>
                  <Typography
                      variant="overline" color="primary" fontWeight={700}
                  >
                    Admin Console
                  </Typography>
                  <Typography variant="h4" fontWeight={800}>
                    Supply Admin Dashboard
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    .CSV, .XLSX, or .XLS files only
                  </Typography>
                </Stack>

                {isAdmin ? (
                  <FormControl sx={{ minWidth: '9rem' }}>
                    <InputLabel id="uic-select-label">Select a UIC</InputLabel>
                    <Select
                      labelId="uic-select-label"
                      id="uic-select"
                      value={selectedUic?.uicId ?? ''}
                      label="Select a UIC"
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
              </Stack>

              <Divider />

              <IngestItems uic={selectedUic} />
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
