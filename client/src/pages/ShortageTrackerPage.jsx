import {
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
// Below is only if you want a button to go 'back' somewhere; doesn't make sense for this page, per my comments on 60 & 61
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";

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
  const navigate = useNavigate();
  const shortages = mockShortages;

  return (
    // Whole thing felt too big on SHRViewPage and I wanted them to match, if it's messing things up change the below line back to: <Stack spacing={2} sx={{ width: "100%", p: 3 }}>
    <Stack spacing={2} sx={{ width: "100%", p: 3, maxWidth: 1200, mx: "auto" }}>
      {/* Header bar - if we wind up moving it into the MiniDrawer so be it */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
      >
        <Typography variant="h5" fontWeight={700}>
          Shortage Tracker
        </Typography>
        {/* I think it's best if shortage is just navigated to through sidebar so I commented this out */}
        {/* <Button onClick={() => navigate("/inventorytable")} variant="outlined">
          Back to Inventory Page
        </Button> */}
      </Stack>

      <Divider />

      {/* Message if no shortages found */}
      {shortages.length === 0 ? (
        <Typography color="text.secondary">
          No shortages found. All inventoried components match their authorized
          quantities. Congrats!
        </Typography>
      ) : (
        // Actual shortage table
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1 }}
        >
          {/* Table headers & columns */}
          <Table aria-label="shortage tracker table">
            <TableHead sx={{ backgroundColor: "action.selected" }}>
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

            {/* Actual table content - currently hard coded to mock data */}
            <TableBody>
              {shortages.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>{item.endItem}</TableCell>
                  <TableCell>{item.niin}</TableCell>
                  <TableCell>{item.partNumber}</TableCell>
                  <TableCell>{item.displayName}</TableCell>
                  <TableCell>{item.authQty}</TableCell>
                  <TableCell>{item.ohQty}</TableCell>
                  <TableCell>{item.variance}</TableCell>
                  <TableCell
                    sx={{
                      color:
                        item.status === "Short" ? "error.main" : "info.main",
                      fontWeight: 600,
                    }}
                  >
                    {item.status}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Stack>
  );
}

export default ShortageTrackerPage;
