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

function InventoryTable() {
  const items = [
    {
      id: 1,
      niin: "001234567",
      partNumber: "123-ABC",
      displayName: "Cable Assembly",
      authQty: 5,
    },
    {
      id: 2,
      niin: "008765432",
      partNumber: "456-DEF",
      displayName: "Adapter Tool",
      authQty: 2,
    },
  ];

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        End Item Inventory
      </Typography>

      <TableContainer component={Paper}>
        <Table aria-label="inventory table">
          <TableHead>
            <TableRow>
              <TableCell>NIIN</TableCell>
              <TableCell>Part Number</TableCell>
              <TableCell>Display Name</TableCell>
              <TableCell>Authorized Qty</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.niin}</TableCell>
                <TableCell>{item.partNumber}</TableCell>
                <TableCell>{item.displayName}</TableCell>
                <TableCell>{item.authQty}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default InventoryTable;
