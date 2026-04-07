import {
  Box,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const mockShortages = [
  {
    id: 1,
    endItem: "AN/PRC-117G",
    niin: "001234567",
    partNumber: "123-ABC",
    displayName: "Cable Assembly",
    authQty: 5,
    ohQty: 3,
    variance: -2,
    status: "Short",
  },
  {
    id: 2,
    endItem: "AN/PRC-117G",
    niin: "008765432",
    partNumber: "456-DEF",
    displayName: "Adapter Tool",
    authQty: 2,
    ohQty: 4,
    variance: 2,
    status: "Over",
  },
];

function ShortageTrackerPage() {
  const shortages = mockShortages;
  const { id } = useParams()
  const { user } = useAuth()

  if (user && user.uic !== id) {
  return <div>Access Denied</div>
  }

  return (
    <Box sx={styles.page}>
      <Box sx={styles.header}>
        <Typography variant="h5" fontWeight={700}>
          Shortage Tracker
        </Typography>
      </Box>

      <Divider sx={styles.divider} />

      {shortages.length === 0 ? (
        <Typography sx={styles.emptyMessage}>
          No shortages found. All inventoried components match their authorized
          quantities. Congrats!
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={styles.tableContainer}>
          <Table aria-label="shortage tracker table">
            <TableHead sx={styles.tableHead}>
              <TableRow>
                <TableCell>End Item</TableCell>
                <TableCell>Component NIIN</TableCell>
                <TableCell>Part Number</TableCell>
                <TableCell>Display Name</TableCell>
                <TableCell>Auth Qty</TableCell>
                <TableCell>On Hand Qty</TableCell>
                <TableCell>Variance</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {shortages.map((item) => (
                <TableRow key={item.id} sx={styles.row}>
                  <TableCell>{item.endItem}</TableCell>
                  <TableCell>{item.niin}</TableCell>
                  <TableCell>{item.partNumber}</TableCell>
                  <TableCell>{item.displayName}</TableCell>
                  <TableCell>{item.authQty}</TableCell>
                  <TableCell>{item.ohQty}</TableCell>
                  <TableCell>{item.variance}</TableCell>
                  <TableCell
                    sx={
                      item.status === "Short"
                        ? styles.statusShort
                        : styles.statusOver
                    }
                  >
                    {item.status}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    p: 3,
    maxWidth: 1200,
    mx: "auto",
    width: "100%",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  divider: {
    width: "100%",
  },
  emptyMessage: {
    width: "100%",
  },
  tableContainer: {
    width: "100%",
    border: "1px solid",
    borderColor: "grey.400",
    borderRadius: 1,
    boxShadow: "none",
  },
  tableHead: {
    backgroundColor: "grey.100",
  },
  row: {
    "&:hover": {
      backgroundColor: "action.hover",
    },
  },
  statusShort: {
    color: "error.main",
    fontWeight: 600,
  },
  statusOver: {
    color: "info.main",
    fontWeight: 600,
  },
};

export default ShortageTrackerPage;
