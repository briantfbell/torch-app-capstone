import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Collapse,
  Container,
  Divider,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterListIcon from "@mui/icons-material/FilterList";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import PdfModalViewer from "../components/PdfModalViewer";

const str = (val) => (val == null ? "" : String(val));

function SerialChip({ serial, index, onClick }) {
  const isVerified = serial.status === "verified";
  return (
    <Chip
      label={`S/N #${index + 1} - ${serial.serial_number}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick(serial);
      }}
      sx={{
        width: "100%",
        border: "2px solid",
        borderColor: isVerified ? "success.main" : "error.main",
        // color: isVerified ? "success.dark" : "error.dark",
        color: "text.primary",
        backgroundColor: isVerified ? "success.50" : "error.50",
        fontWeight: 400,
        fontSize: "0.8rem",
        height: 36,
        px: 1,
        cursor: "pointer",
        "&:hover": {
          backgroundColor: isVerified ? "success.100" : "error.100",
          transform: "scale(1.03)",
          transition: "transform 0.15s",
        },
      }}
    />
  );
}

function GroupedEndItemCard({ group, onCardClick, onSerialClick, selected }) {
  const [expanded, setExpanded] = useState(false);
  const { representative, serials } = group;

  const verifiedCount = serials.filter(
    (s) => s.status === "inventoried",
  ).length;
  const needsVerifyCount = serials.length - verifiedCount;
  const allVerified = serials.length > 0 && verifiedCount === serials.length;

  const firstSerial = serials[0];

  const handleCardClick = () => {
    if (firstSerial) onCardClick(firstSerial.end_item_id);
    else onCardClick(representative.id);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Card
        variant="outlined"
        onClick={handleCardClick}
        sx={{
          borderColor: selected ? "primary.main" : "grey.300",
          borderWidth: 1,
          borderBottomLeftRadius: serials.length > 0 ? 0 : undefined,
          borderBottomRightRadius: serials.length > 0 ? 0 : undefined,
          borderBottom: serials.length > 0 ? "none" : undefined,
          backgroundColor: selected ? "primary.light" : "background.paper",
          transition: "box-shadow 0.2s, border-color 0.2s, transform 0.15s",
          cursor: "pointer",
          "&:hover": {
            boxShadow: 3,
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "#202425" : "#cfcfcf",
            borderColor: "primary.main",
          },
        }}
      >
        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
          <Stack spacing={1.5} alignItems="center" textAlign="center">
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              width="100%"
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                {allVerified ? (
                  <CheckCircleOutlineIcon
                    sx={{ fontSize: 16, color: "success.main" }}
                  />
                ) : (
                  <ErrorOutlineIcon
                    sx={{ fontSize: 16, color: "error.main" }}
                  />
                )}
                <Typography
                  variant="caption"
                  color={allVerified ? "success.main" : "error.main"}
                  fontWeight={600}
                >
                  {allVerified ? "Inventory Complete" : "Needs Inventoried"}
                </Typography>
              </Box>
              <Chip
                label={`Qty: ${serials.length}`}
                size="small"
                variant="outlined"
                sx={{ flexShrink: 0 }}
              />
            </Stack>

            <Box
              sx={{
                width: "100%",
                minHeight: 64,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{
                  textAlign: "center",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  lineHeight: 1.4,
                }}
              >
                {str(representative.description)}
              </Typography>
            </Box>

            <Divider flexItem />

            <Stack
              direction="row"
              spacing={3}
              justifyContent="center"
              flexWrap="wrap"
              sx={{ minHeight: 44, alignItems: "center" }}
            >
              {[
                { label: "LIN", value: representative.lin },
                { label: "FSC", value: representative.fsc },
                { label: "NIIN", value: representative.niin },
              ].map(({ label, value }) => (
                <Box key={label} textAlign="center">
                  <Typography variant="caption" color="text.secondary">
                    {label}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {str(value)}
                  </Typography>
                </Box>
              ))}
            </Stack>

            <Typography
              variant="caption"
              color="text.disabled"
              sx={{ fontStyle: "italic" }}
            >
              Tap to view details
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {serials.length > 0 && (
        <Accordion
          expanded={expanded}
          onChange={(_e, isExpanded) => setExpanded(isExpanded)}
          disableGutters
          elevation={0}
          TransitionProps={{ unmountOnExit: true }}
          sx={{
            border: "1px solid",
            borderColor: selected ? "primary.main" : "grey.300",
            borderTop: "1px solid",
            borderTopColor: "grey.200",
            borderBottomLeftRadius: "4px !important",
            borderBottomRightRadius: "4px !important",
            borderTopLeftRadius: "0 !important",
            borderTopRightRadius: "0 !important",
            "&:before": { display: "none" },
            backgroundColor: "background.paper",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              px: 2,
              py: 0.5,
              minHeight: 44,
              backgroundColor: expanded ? "action.hover" : "transparent",
              transition: "background-color 0.2s",
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              flexWrap="wrap"
            >
              <Typography variant="caption" fontWeight={600}>
                View by Serial Number:
              </Typography>
              {verifiedCount > 0 && (
                <Chip
                  label={`${needsVerifyCount} ${needsVerifyCount === 1 ? "Item Found" : "Items Found"}`}
                  size="small"
                  color="success"
                  variant="outlined"
                  sx={{ height: 18, fontSize: "0.65rem" }}
                />
              )}
              {needsVerifyCount > 0 && (
                <Chip
                  label={`${needsVerifyCount} ${needsVerifyCount === 1 ? "Item Found" : "Items Found"}`}
                  size="small"
                  color="error"
                  variant="outlined"
                  sx={{ height: 18, fontSize: "0.65rem" }}
                />
              )}
            </Stack>
          </AccordionSummary>

          <AccordionDetails sx={{ px: 2, pb: 2 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mb: 1 }}
            >
              Tap a serial number to view its details
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 1.5,
              }}
            >
              {serials.map((serial, index) => (
                <SerialChip
                  key={serial.id}
                  serial={serial}
                  index={index}
                  onClick={() => onSerialClick(serial)}
                />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
}

const ALL = "All";
const VERIFICATION_ALL = "all";
const VERIFICATION_NEEDED = "needed";
const VERIFICATION_COMPLETE = "complete";

export default function EquipmentPage() {
  const navigate = useNavigate();
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [endItems, setEndItems] = useState([]);
  const [serialItems, setSerialItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uic, setUic] = useState("");
  const [openPdf, setOpenPdf] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [verificationFilter, setVerificationFilter] =
    useState(VERIFICATION_ALL);
  const [linFilter, setLinFilter] = useState(ALL);
  const [niinFilter, setNiinFilter] = useState(ALL);
  const [fscFilter, setFscFilter] = useState(ALL);
  const [descFilter, setDescFilter] = useState(ALL);

  useEffect(() => {
    fetch("http://localhost:8080/auth/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setUic(data.user?.uic ?? ""))
      .catch((err) => console.error("Failed to load user:", err));
  }, []);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:8080/end-items", { credentials: "include" }).then(
        (r) => r.json(),
      ),
      fetch("http://localhost:8080/serial-items", {
        credentials: "include",
      }).then((r) => r.json()),
    ])
      .then(([endData, serialData]) => {
        setEndItems(endData.allEndItems);
        setSerialItems(serialData.allSerialEndItems ?? []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load data:", err);
        setLoading(false);
      });
  }, []);

  // Diagnostic — remove once working
  useEffect(() => {
    console.log("serialItems updated:", serialItems.length, serialItems[0]);
  }, [serialItems]);

  // Each end_item_id maps to an ARRAY of serials
  const serialByEndItemId = useMemo(() => {
    const map = {};
    serialItems.forEach((s) => {
      if (!map[s.end_item_id]) map[s.end_item_id] = [];
      map[s.end_item_id].push(s);
    });
    return map;
  }, [serialItems]);

  // Group end items by LIN+NIIN+FSC+description, spreading all matching serials in
  const groupedItems = useMemo(() => {
    const groupMap = {};
    endItems.forEach((item) => {
      const key = `${str(item.lin)}||${str(item.niin)}||${str(item.fsc)}||${str(item.description)}`;
      if (!groupMap[key]) {
        groupMap[key] = {
          key,
          representative: item,
          endItemIds: [],
          serials: [],
        };
      }
      groupMap[key].endItemIds.push(item.id);
      const serials = serialByEndItemId[item.id];
      if (serials) groupMap[key].serials.push(...serials);
    });
    return Object.values(groupMap);
  }, [endItems, serialByEndItemId]);

  const filteredGroups = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return groupedItems.filter((group) => {
      const r = group.representative;
      const matchesSearch =
        !q ||
        str(r.lin).toLowerCase().includes(q) ||
        str(r.niin).toLowerCase().includes(q) ||
        str(r.fsc).toLowerCase().includes(q) ||
        str(r.description).toLowerCase().includes(q);

      const matchesLin = linFilter === ALL || str(r.lin) === linFilter;
      const matchesNiin = niinFilter === ALL || str(r.niin) === niinFilter;
      const matchesFsc = fscFilter === ALL || str(r.fsc) === fscFilter;
      const matchesDesc =
        descFilter === ALL || str(r.description) === descFilter;

      const verifiedCount = group.serials.filter(
        (s) => s.status === "verified",
      ).length;
      const needsVerify = verifiedCount < group.serials.length;
      const allVerified =
        group.serials.length > 0 && verifiedCount === group.serials.length;

      const matchesVerification =
        verificationFilter === VERIFICATION_ALL ||
        (verificationFilter === VERIFICATION_NEEDED && needsVerify) ||
        (verificationFilter === VERIFICATION_COMPLETE && allVerified);

      return (
        matchesSearch &&
        matchesLin &&
        matchesNiin &&
        matchesFsc &&
        matchesDesc &&
        matchesVerification
      );
    });
  }, [
    groupedItems,
    searchQuery,
    linFilter,
    niinFilter,
    fscFilter,
    descFilter,
    verificationFilter,
  ]);

  const linOptions = useMemo(() => {
    const base = groupedItems.filter(
      (g) =>
        (niinFilter === ALL || str(g.representative.niin) === niinFilter) &&
        (fscFilter === ALL || str(g.representative.fsc) === fscFilter) &&
        (descFilter === ALL ||
          str(g.representative.description) === descFilter),
    );
    return [
      ALL,
      ...[
        ...new Set(base.map((g) => str(g.representative.lin)).filter(Boolean)),
      ].sort(),
    ];
  }, [groupedItems, niinFilter, fscFilter, descFilter]);

  const fscOptions = useMemo(() => {
    const base = groupedItems.filter(
      (g) =>
        (linFilter === ALL || str(g.representative.lin) === linFilter) &&
        (niinFilter === ALL || str(g.representative.niin) === niinFilter) &&
        (descFilter === ALL ||
          str(g.representative.description) === descFilter),
    );
    return [
      ALL,
      ...[
        ...new Set(base.map((g) => str(g.representative.fsc)).filter(Boolean)),
      ].sort(),
    ];
  }, [groupedItems, linFilter, niinFilter, descFilter]);

  const niinOptions = useMemo(() => {
    const base = groupedItems.filter(
      (g) =>
        (linFilter === ALL || str(g.representative.lin) === linFilter) &&
        (fscFilter === ALL || str(g.representative.fsc) === fscFilter) &&
        (descFilter === ALL ||
          str(g.representative.description) === descFilter),
    );
    return [
      ALL,
      ...[
        ...new Set(base.map((g) => str(g.representative.niin)).filter(Boolean)),
      ].sort(),
    ];
  }, [groupedItems, linFilter, fscFilter, descFilter]);

  const descOptions = useMemo(() => {
    const base = groupedItems.filter(
      (g) =>
        (linFilter === ALL || str(g.representative.lin) === linFilter) &&
        (fscFilter === ALL || str(g.representative.fsc) === fscFilter) &&
        (niinFilter === ALL || str(g.representative.niin) === niinFilter),
    );
    return [
      ALL,
      ...[
        ...new Set(
          base.map((g) => str(g.representative.description)).filter(Boolean),
        ),
      ].sort(),
    ];
  }, [groupedItems, linFilter, fscFilter, niinFilter]);

  const handleLinChange = (val) => {
    setLinFilter(val);
    const remaining = groupedItems.filter(
      (g) =>
        (val === ALL || str(g.representative.lin) === val) &&
        (fscFilter === ALL || str(g.representative.fsc) === fscFilter) &&
        (descFilter === ALL ||
          str(g.representative.description) === descFilter),
    );
    if (
      niinFilter !== ALL &&
      !new Set(remaining.map((g) => str(g.representative.niin))).has(niinFilter)
    )
      setNiinFilter(ALL);
    if (
      fscFilter !== ALL &&
      !new Set(remaining.map((g) => str(g.representative.fsc))).has(fscFilter)
    )
      setFscFilter(ALL);
    if (
      descFilter !== ALL &&
      !new Set(remaining.map((g) => str(g.representative.description))).has(
        descFilter,
      )
    )
      setDescFilter(ALL);
  };

  const handleFscChange = (val) => {
    setFscFilter(val);
    const remaining = groupedItems.filter(
      (g) =>
        (linFilter === ALL || str(g.representative.lin) === linFilter) &&
        (val === ALL || str(g.representative.fsc) === val) &&
        (niinFilter === ALL || str(g.representative.niin) === niinFilter) &&
        (descFilter === ALL ||
          str(g.representative.description) === descFilter),
    );
    if (
      linFilter !== ALL &&
      !new Set(remaining.map((g) => str(g.representative.lin))).has(linFilter)
    )
      setLinFilter(ALL);
    if (
      niinFilter !== ALL &&
      !new Set(remaining.map((g) => str(g.representative.niin))).has(niinFilter)
    )
      setNiinFilter(ALL);
    if (
      descFilter !== ALL &&
      !new Set(remaining.map((g) => str(g.representative.description))).has(
        descFilter,
      )
    )
      setDescFilter(ALL);
  };

  const handleNiinChange = (val) => {
    setNiinFilter(val);
    const remaining = groupedItems.filter(
      (g) =>
        (linFilter === ALL || str(g.representative.lin) === linFilter) &&
        (fscFilter === ALL || str(g.representative.fsc) === fscFilter) &&
        (val === ALL || str(g.representative.niin) === val) &&
        (descFilter === ALL ||
          str(g.representative.description) === descFilter),
    );
    if (
      linFilter !== ALL &&
      !new Set(remaining.map((g) => str(g.representative.lin))).has(linFilter)
    )
      setLinFilter(ALL);
    if (
      fscFilter !== ALL &&
      !new Set(remaining.map((g) => str(g.representative.fsc))).has(fscFilter)
    )
      setFscFilter(ALL);
    if (
      descFilter !== ALL &&
      !new Set(remaining.map((g) => str(g.representative.description))).has(
        descFilter,
      )
    )
      setDescFilter(ALL);
  };

  const handleDescChange = (val) => {
    setDescFilter(val);
    const remaining = groupedItems.filter(
      (g) =>
        (linFilter === ALL || str(g.representative.lin) === linFilter) &&
        (fscFilter === ALL || str(g.representative.fsc) === fscFilter) &&
        (niinFilter === ALL || str(g.representative.niin) === niinFilter) &&
        (val === ALL || str(g.representative.description) === val),
    );
    if (
      linFilter !== ALL &&
      !new Set(remaining.map((g) => str(g.representative.lin))).has(linFilter)
    )
      setLinFilter(ALL);
    if (
      fscFilter !== ALL &&
      !new Set(remaining.map((g) => str(g.representative.fsc))).has(fscFilter)
    )
      setFscFilter(ALL);
    if (
      niinFilter !== ALL &&
      !new Set(remaining.map((g) => str(g.representative.niin))).has(niinFilter)
    )
      setNiinFilter(ALL);
  };

  const dropdownsActive =
    linFilter !== ALL ||
    niinFilter !== ALL ||
    fscFilter !== ALL ||
    descFilter !== ALL;

  const isFiltered =
    searchQuery.trim() !== "" ||
    dropdownsActive ||
    verificationFilter !== VERIFICATION_ALL;

  const handleClearFilters = () => {
    setSearchQuery("");
    setLinFilter(ALL);
    setNiinFilter(ALL);
    setFscFilter(ALL);
    setDescFilter(ALL);
    setVerificationFilter(VERIFICATION_ALL);
  };

  const handleCardClick = (endItemId) => {
    setSelectedGroup(endItemId);
    navigate(`/equipment/${endItemId}`);
  };

  const handleSerialClick = (serial) => {
    navigate(`/equipment/${serial.end_item_id}`);
  };

  if (loading) {
    return (
      <Box sx={{ mx: "auto", width: "100%", py: 4 }}>
        <Stack
          spacing={2}
          alignItems="center"
          justifyContent="center"
          sx={{ minHeight: "60vh" }}
        >
          <CircularProgress />
          <Typography>Loading equipment...</Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ mx: "auto", width: "100%", py: 4 }}>
      <Stack spacing={3}>
        <PdfModalViewer
          open={openPdf}
          onClose={() => setOpenPdf(false)}
          pdfUrl="/pdfs/WJQ1D0_Sub_Hand_Receipt_GOSPEL.pdf"
        />

        {/* End Items card */}
        <Card variant="outlined">
          <CardContent>
            {/* Title + count */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Chip
                  label={uic ? `UIC: ${uic}` : "Loading..."}
                  variant="outlined"
                  color="primary"
                  sx={{ minWidth: 120 }}
                />
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  letterSpacing={1}
                >
                  Accountable End Items
                </Typography>
              </Stack>

              <Button
                variant="outlined"
                startIcon={<PictureAsPdfIcon />}
                onClick={() => setOpenPdf(true)}
                sx={{ py: 0.75, fontSize: "0.875rem" }}
              >
                Sub Hand Receipt PDF
              </Button>

              <Typography variant="caption" color="text.secondary">
                {filteredGroups.length} of {groupedItems.length} items
              </Typography>
            </Stack>

            {/* Search + Filter toggle */}
            <Stack direction="row" spacing={1} mb={2} alignItems="center">
              <TextField
                fullWidth
                placeholder="Search by description, LIN, NIIN, FSC…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                inputProps={{
                  id: "equipment-search",
                  name: "equipment-search",
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "divider" },
                    "&:hover fieldset": { borderColor: "text.secondary" },
                    "&.Mui-focused fieldset": { borderColor: "primary.main" },
                  },
                }}
              />
              <Button
                variant={
                  showFilters || dropdownsActive ? "contained" : "outlined"
                }
                startIcon={<FilterListIcon />}
                onClick={() => setShowFilters((prev) => !prev)}
                sx={{
                  whiteSpace: "nowrap",
                  minWidth: 130,
                  py: 1.85,
                  borderColor: "divider",
                  "&.MuiButton-outlined": { borderColor: "divider" },
                }}
              >
                {dropdownsActive ? "Filtered" : "Filters"}
                {dropdownsActive && (
                  <Box
                    component="span"
                    sx={{
                      ml: 0.5,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      backgroundColor: "white",
                      color: "primary.main",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {
                      [linFilter, fscFilter, niinFilter, descFilter].filter(
                        (v) => v !== ALL,
                      ).length
                    }
                  </Box>
                )}
              </Button>
            </Stack>

            {/* Collapsible dropdown filters */}
            <Collapse in={showFilters}>
              <Box
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 2,
                  mb: 2,
                  backgroundColor: "action.hover",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={600}
                  sx={{ mb: 1.5, display: "block" }}
                >
                  FILTER BY FIELD
                </Typography>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  flexWrap="wrap"
                >
                  {[
                    {
                      label: "LIN",
                      id: "filter-lin",
                      value: linFilter,
                      options: linOptions,
                      onChange: handleLinChange,
                      minWidth: 140,
                    },
                    {
                      label: "FSC",
                      id: "filter-fsc",
                      value: fscFilter,
                      options: fscOptions,
                      onChange: handleFscChange,
                      minWidth: 140,
                    },
                    {
                      label: "NIIN",
                      id: "filter-niin",
                      value: niinFilter,
                      options: niinOptions,
                      onChange: handleNiinChange,
                      minWidth: 180,
                    },
                    {
                      label: "Description",
                      id: "filter-desc",
                      value: descFilter,
                      options: descOptions,
                      onChange: handleDescChange,
                      minWidth: 220,
                      flex: 1,
                    },
                  ].map(
                    ({
                      label,
                      id,
                      value,
                      options,
                      onChange,
                      minWidth,
                      flex,
                    }) => (
                      <TextField
                        key={label}
                        select
                        label={label}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        size="small"
                        inputProps={{ id, name: id }}
                        sx={{
                          minWidth: { xs: "100%", sm: minWidth },
                          ...(flex ? { flex } : {}),
                          backgroundColor: "background.paper",
                          borderRadius: 1,
                          "& .MuiSelect-select": { color: "text.primary" },
                          "& .MuiInputLabel-root": { color: "text.secondary" },
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "divider" },
                            "&:hover fieldset": {
                              borderColor: "text.secondary",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "primary.main",
                            },
                          },
                        }}
                        SelectProps={{
                          MenuProps: {
                            PaperProps: {
                              sx: {
                                bgcolor: "background.paper",
                                "& .MuiMenuItem-root": {
                                  color: "text.primary",
                                },
                              },
                            },
                          },
                        }}
                      >
                        {options.map((v) => (
                          <MenuItem
                            key={v}
                            value={v}
                            sx={{ color: "text.primary" }}
                          >
                            {v}
                          </MenuItem>
                        ))}
                      </TextField>
                    ),
                  )}
                </Stack>
              </Box>
            </Collapse>

            {/* Verification status toggle + clear */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "flex-start", sm: "center" }}
              justifyContent="space-between"
              spacing={2}
              mb={3}
            >
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={600}
                >
                  SHOW
                </Typography>
                <ToggleButtonGroup
                  value={verificationFilter}
                  exclusive
                  onChange={(_e, val) => {
                    if (val !== null) setVerificationFilter(val);
                  }}
                  size="small"
                  sx={{
                    "& .MuiToggleButtonGroup-grouped": {
                      borderColor: "divider",
                    },
                  }}
                >
                  <ToggleButton
                    value={VERIFICATION_ALL}
                    sx={{ px: 2, borderColor: "divider" }}
                  >
                    All
                  </ToggleButton>
                  <ToggleButton
                    value={VERIFICATION_NEEDED}
                    sx={{
                      px: 2,
                      borderColor: "divider",
                      color: "error.main",
                      "&:hover": { backgroundColor: "error.50" },
                      "&.Mui-selected": {
                        backgroundColor: "error.main",
                        color: "white",
                        borderColor: "error.main",
                        "&:hover": { backgroundColor: "error.dark" },
                      },
                    }}
                  >
                    <ErrorOutlineIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    Needs Inventoried
                  </ToggleButton>
                  <ToggleButton
                    value={VERIFICATION_COMPLETE}
                    sx={{
                      px: 2,
                      borderColor: "divider",
                      color: "success.main",
                      "&:hover": { backgroundColor: "success.50" },
                      "&.Mui-selected": {
                        backgroundColor: "success.main",
                        color: "white",
                        borderColor: "success.main",
                        "&:hover": { backgroundColor: "success.dark" },
                      },
                    }}
                  >
                    <CheckCircleOutlineIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    Inventory Complete
                  </ToggleButton>
                </ToggleButtonGroup>
              </Stack>

              {isFiltered && (
                <Button
                  variant="text"
                  size="small"
                  onClick={handleClearFilters}
                  sx={{ color: "text.secondary", textDecoration: "underline" }}
                >
                  Clear all filters
                </Button>
              )}
            </Stack>

            {/* Card grid */}
            {filteredGroups.length === 0 ? (
              <Stack alignItems="center" spacing={1} py={6}>
                <SearchIcon sx={{ fontSize: 48, color: "text.disabled" }} />
                <Typography
                  variant="body1"
                  color="text.secondary"
                  fontWeight={500}
                >
                  No equipment found
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  Try adjusting your search or filters
                </Typography>
                {isFiltered && (
                  <Button size="small" onClick={handleClearFilters}>
                    Clear filters
                  </Button>
                )}
              </Stack>
            ) : (
              <Box
                sx={{
                  maxHeight: 800,
                  overflowY: "auto",
                  pr: 0.5,
                  "&::-webkit-scrollbar": { width: 8 },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "grey.400",
                    borderRadius: 4,
                  },
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "1fr 1fr",
                      lg: "1fr 1fr 1fr",
                    },
                    gap: 2,
                    alignItems: "start",
                  }}
                >
                  {filteredGroups.map((group) => (
                    <GroupedEndItemCard
                      key={group.key}
                      group={group}
                      onCardClick={handleCardClick}
                      onSerialClick={handleSerialClick}
                      selected={selectedGroup === group.representative.id}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
