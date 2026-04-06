import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

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

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Shortage Tracker
      </Typography>

      {shortages.length === 0 ? (
        <Typography variant="body1">
          No shortages found. All inventoried components match their authorized
          quantities.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="shortage tracker table">
            <TableHead>
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
                <TableRow key={item.id}>
                  <TableCell>{item.endItem}</TableCell>
                  <TableCell>{item.niin}</TableCell>
                  <TableCell>{item.partNumber}</TableCell>
                  <TableCell>{item.displayName}</TableCell>
                  <TableCell>{item.authQty}</TableCell>
                  <TableCell>{item.ohQty}</TableCell>
                  <TableCell>{item.variance}</TableCell>
                  <TableCell>{item.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}

export default ShortageTrackerPage;
