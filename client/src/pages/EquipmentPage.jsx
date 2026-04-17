import {useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Collapse,
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

function SerialChip({ serial, index, isSeen, onClick }) {
  return (
    <Chip
      label={`S/N: ${serial.serial_number}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick(serial);
      }}
      color={isSeen ? "success" : "error"}
      sx={{
        width: "100%",
        fontWeight: 600,
        fontSize: "0.8rem",
        height: 36,
        px: 1,
        cursor: "pointer",
        "&:hover": {
          opacity: 0.85,
          transform: "scale(1.03)",
          transition: "transform 0.15s",
        },
      }}
    />
  );
}

function GroupedEndItemCard({ group, onSerialClick, selected, seenBySerialId }) {
  const [expanded, setExpanded] = useState(false);
  const { representative, serials } = group;

  const verifiedCount = serials.filter((s) => seenBySerialId[s.id]).length;
  const needsVerifyCount = serials.length - verifiedCount;
  const allVerified = serials.length > 0 && verifiedCount === serials.length;

  const cardBorderColor = selected ? "primary.main" : "divider";

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Card
        elevation={0}
        sx={{
          borderRadius: serials.length > 0 ? "8px 8px 0 0" : 2,
          border: "1px solid",
          borderColor: cardBorderColor,
          borderBottom: serials.length > 0 ? "none" : undefined,
          backgroundColor: "action.hover",
          cursor: 'pointer'
        }}
        onClick={(isExpanded) => setExpanded(isExpanded => !isExpanded)}
      >
        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
          <Stack spacing={1.5} alignItems="center" textAlign="center">
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" width="100%">
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                {allVerified ? (
                  <CheckCircleOutlineIcon sx={{ fontSize: 16, color: "success.main" }} />
                ) : (
                  <ErrorOutlineIcon sx={{ fontSize: 16, color: "error.main" }} />
                )}
                <Typography
                  variant="caption"
                  color={allVerified ? "success.main" : "error.main"}
                  fontWeight={700}
                >
                  {allVerified ? "COMPLETED" : "NEEDS INVENTORY"}
                </Typography>
              </Box>
              <Chip label={`Qty: ${serials.length}`} size="small" variant="outlined" sx={{ flexShrink: 0 }} />
            </Stack>

            <Box sx={{ width: "100%", minHeight: 64, display: "flex", alignItems: "center", justifyContent: "center" }}>
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

            <Stack direction="row" spacing={3} justifyContent="center" flexWrap="wrap" sx={{ minHeight: 44, alignItems: "center" }}>
              {[
                { label: "LIN", value: representative.lin },
                { label: "FSC", value: representative.fsc },
                { label: "NIIN", value: representative.niin },
              ].map(({ label, value }) => (
                <Box key={label} textAlign="center">
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    {label}
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {str(value)}
                  </Typography>
                </Box>
              ))}
            </Stack>
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
            borderColor: cardBorderColor,
            borderTop: "1px solid",
            borderTopColor: "divider",
            borderBottomLeftRadius: "8px !important",
            borderBottomRightRadius: "8px !important",
            borderTopLeftRadius: "0 !important",
            borderTopRightRadius: "0 !important",
            "&:before": { display: "none" },
            backgroundColor: "action.hover",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              px: 2,
              py: 0.5,
              minHeight: 44,
              backgroundColor: expanded ? "action.selected" : "transparent",
              transition: "background-color 0.2s",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Typography variant="caption" fontWeight={700}>
                Verify Serial Numbers:
              </Typography>
              {verifiedCount > 0 && (
                <Chip
                  label={`${verifiedCount} COMPLETED`}
                  size="small"
                  color="success"
                  sx={{ height: 18, fontSize: "0.65rem", fontWeight: "600" }}
                />
              )}
              {needsVerifyCount > 0 && (
                <Chip
                  label={`${needsVerifyCount} NEEDS INVENTORY`}
                  size="small"
                  color="error"
                  sx={{ height: 18, fontSize: "0.65rem", fontWeight: "600" }}
                />
              )}
            </Stack>
          </AccordionSummary>

          <AccordionDetails sx={{ px: 2, pb: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
              Tap a serial number to view its details
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: 1.5,
                width: "100%",
              }}
            >
              {serials.map((serial, index) => (
                <SerialChip
                  key={serial.id}
                  serial={serial}
                  index={index}
                  isSeen={seenBySerialId[serial.id] ?? false}
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
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uic, setUic] = useState("");
  const [openPdf, setOpenPdf] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [verificationFilter, setVerificationFilter] = useState(VERIFICATION_ALL);
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
      fetch("http://localhost:8080/end-items", { credentials: "include" }).then((r) => r.json()),
      fetch("http://localhost:8080/serial-items", { credentials: "include" }).then((r) => r.json()),
      fetch("http://localhost:8080/current-history/end-items", { credentials: "include" }).then((r) => r.json()),
    ])
      .then(([endData, serialData, historyData]) => {
        setEndItems(endData.allEndItems ?? []);
        setSerialItems(serialData.allSerialEndItems ?? []);
        setHistoryItems(historyData.currentHistory ?? []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load data:", err);
        setLoading(false);
      });
  }, []);

  const seenBySerialId = useMemo(() => {
    const map = {};
    historyItems.forEach((h) => {
      if (h.serial_number != null) map[h.serial_number] = h.seen === true;
    });
    return map;
  }, [historyItems]);

  const serialByEndItemId = useMemo(() => {
    const map = {};
    serialItems.forEach((s) => {
      if (!map[s.end_item_id]) map[s.end_item_id] = [];
      map[s.end_item_id].push(s);
    });
    return map;
  }, [serialItems]);

  const groupedItems = useMemo(() => {
    const groupMap = {};
    endItems.forEach((item) => {
      const key = `${str(item.lin)}||${str(item.niin)}||${str(item.fsc)}||${str(item.description)}`;
      if (!groupMap[key]) {
        groupMap[key] = { key, representative: item, endItemIds: [], serials: [] };
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
      const matchesDesc = descFilter === ALL || str(r.description) === descFilter;

      const verifiedCount = group.serials.filter((s) => seenBySerialId[s.id]).length;
      const needsVerify = verifiedCount < group.serials.length;
      const allVerified = group.serials.length > 0 && verifiedCount === group.serials.length;

      const matchesVerification =
        verificationFilter === VERIFICATION_ALL ||
        (verificationFilter === VERIFICATION_NEEDED && needsVerify) ||
        (verificationFilter === VERIFICATION_COMPLETE && allVerified);

      return matchesSearch && matchesLin && matchesNiin && matchesFsc && matchesDesc && matchesVerification;
    });
  }, [groupedItems, searchQuery, linFilter, niinFilter, fscFilter, descFilter, verificationFilter, seenBySerialId]);

  const linOptions = useMemo(() => {
    const base = groupedItems.filter(
      (g) =>
        (niinFilter === ALL || str(g.representative.niin) === niinFilter) &&
        (fscFilter === ALL || str(g.representative.fsc) === fscFilter) &&
        (descFilter === ALL || str(g.representative.description) === descFilter),
    );
    return [ALL, ...[...new Set(base.map((g) => str(g.representative.lin)).filter(Boolean))].sort()];
  }, [groupedItems, niinFilter, fscFilter, descFilter]);

  const fscOptions = useMemo(() => {
    const base = groupedItems.filter(
      (g) =>
        (linFilter === ALL || str(g.representative.lin) === linFilter) &&
        (niinFilter === ALL || str(g.representative.niin) === niinFilter) &&
        (descFilter === ALL || str(g.representative.description) === descFilter),
    );
    return [ALL, ...[...new Set(base.map((g) => str(g.representative.fsc)).filter(Boolean))].sort()];
  }, [groupedItems, linFilter, niinFilter, descFilter]);

  const niinOptions = useMemo(() => {
    const base = groupedItems.filter(
      (g) =>
        (linFilter === ALL || str(g.representative.lin) === linFilter) &&
        (fscFilter === ALL || str(g.representative.fsc) === fscFilter) &&
        (descFilter === ALL || str(g.representative.description) === descFilter),
    );
    return [ALL, ...[...new Set(base.map((g) => str(g.representative.niin)).filter(Boolean))].sort()];
  }, [groupedItems, linFilter, fscFilter, descFilter]);

  const descOptions = useMemo(() => {
    const base = groupedItems.filter(
      (g) =>
        (linFilter === ALL || str(g.representative.lin) === linFilter) &&
        (fscFilter === ALL || str(g.representative.fsc) === fscFilter) &&
        (niinFilter === ALL || str(g.representative.niin) === niinFilter),
    );
    return [ALL, ...[...new Set(base.map((g) => str(g.representative.description)).filter(Boolean))].sort()];
  }, [groupedItems, linFilter, fscFilter, niinFilter]);

  const handleLinChange = (val) => {
    setLinFilter(val);
    const remaining = groupedItems.filter(
      (g) =>
        (val === ALL || str(g.representative.lin) === val) &&
        (fscFilter === ALL || str(g.representative.fsc) === fscFilter) &&
        (descFilter === ALL || str(g.representative.description) === descFilter),
    );
    if (niinFilter !== ALL && !new Set(remaining.map((g) => str(g.representative.niin))).has(niinFilter)) setNiinFilter(ALL);
    if (fscFilter !== ALL && !new Set(remaining.map((g) => str(g.representative.fsc))).has(fscFilter)) setFscFilter(ALL);
    if (descFilter !== ALL && !new Set(remaining.map((g) => str(g.representative.description))).has(descFilter)) setDescFilter(ALL);
  };

  const handleFscChange = (val) => {
    setFscFilter(val);
    const remaining = groupedItems.filter(
      (g) =>
        (linFilter === ALL || str(g.representative.lin) === linFilter) &&
        (val === ALL || str(g.representative.fsc) === val) &&
        (niinFilter === ALL || str(g.representative.niin) === niinFilter) &&
        (descFilter === ALL || str(g.representative.description) === descFilter),
    );
    if (linFilter !== ALL && !new Set(remaining.map((g) => str(g.representative.lin))).has(linFilter)) setLinFilter(ALL);
    if (niinFilter !== ALL && !new Set(remaining.map((g) => str(g.representative.niin))).has(niinFilter)) setNiinFilter(ALL);
    if (descFilter !== ALL && !new Set(remaining.map((g) => str(g.representative.description))).has(descFilter)) setDescFilter(ALL);
  };

  const handleNiinChange = (val) => {
    setNiinFilter(val);
    const remaining = groupedItems.filter(
      (g) =>
        (linFilter === ALL || str(g.representative.lin) === linFilter) &&
        (fscFilter === ALL || str(g.representative.fsc) === fscFilter) &&
        (val === ALL || str(g.representative.niin) === val) &&
        (descFilter === ALL || str(g.representative.description) === descFilter),
    );
    if (linFilter !== ALL && !new Set(remaining.map((g) => str(g.representative.lin))).has(linFilter)) setLinFilter(ALL);
    if (fscFilter !== ALL && !new Set(remaining.map((g) => str(g.representative.fsc))).has(fscFilter)) setFscFilter(ALL);
    if (descFilter !== ALL && !new Set(remaining.map((g) => str(g.representative.description))).has(descFilter)) setDescFilter(ALL);
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
    if (linFilter !== ALL && !new Set(remaining.map((g) => str(g.representative.lin))).has(linFilter)) setLinFilter(ALL);
    if (fscFilter !== ALL && !new Set(remaining.map((g) => str(g.representative.fsc))).has(fscFilter)) setFscFilter(ALL);
    if (niinFilter !== ALL && !new Set(remaining.map((g) => str(g.representative.niin))).has(niinFilter)) setNiinFilter(ALL);
  };

  const dropdownsActive = linFilter !== ALL || niinFilter !== ALL || fscFilter !== ALL || descFilter !== ALL;
  const isFiltered = searchQuery.trim() !== "" || dropdownsActive || verificationFilter !== VERIFICATION_ALL;

  const handleClearFilters = () => {
    setSearchQuery("");
    setLinFilter(ALL);
    setNiinFilter(ALL);
    setFscFilter(ALL);
    setDescFilter(ALL);
    setVerificationFilter(VERIFICATION_ALL);
  };

  const handleSerialClick = (serial) => {
    navigate(`/equipment/${serial.end_item_id}?serialId=${serial.id}`);
  };

  if (loading) {
    return (
      <Box sx={{ maxWidth: 1500, mx: "auto", width: "100%" }}>
        <Stack spacing={2} alignItems="center" justifyContent="center" sx={{ minHeight: "60vh" }}>
          <CircularProgress />
          <Typography>Loading equipment...</Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1500, mx: "auto", width: "100%" }}>
      <PdfModalViewer
        open={openPdf}
        onClose={() => setOpenPdf(false)}
        pdfUrl="/pdfs/WJQ1D0_Sub_Hand_Receipt_GOSPEL.pdf"
      />

      <Stack spacing={3}>
        <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={2}
            >
              <Stack spacing={1}>
                <Typography variant="overline" color="primary" fontWeight={700}>
                  Equipment
                </Typography>
                <Typography variant="h4" fontWeight={800}>
                  Unit Property and End Items
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  View and verify serial numbers for all unit end items.
                </Typography>
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ xs: "flex-start", sm: "center" }}>
                <Button
                  variant="contained"
                  startIcon={<PictureAsPdfIcon />}
                  onClick={() => setOpenPdf(true)}
                >
                  Sub Hand Receipt
                </Button>
                <Chip
                  label={uic ? `UIC: ${uic}` : "Loading..."}
                  variant="outlined"
                  color="primary"
                  sx={{ height: 36, fontSize: "0.85rem" }}
                />
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Stack spacing={3}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight={700}>
                  End Items
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {filteredGroups.length} of {groupedItems.length} items
                </Typography>
              </Stack>

              <Divider />

              <Stack direction="row" spacing={1} alignItems="center">
                <TextField
                  fullWidth
                  placeholder="Search by description, LIN, NIIN, FSC…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  inputProps={{ id: "equipment-search", name: "equipment-search" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant={dropdownsActive ? "contained" : "outlined"}
                  startIcon={<FilterListIcon />}
                  onClick={() => setShowFilters((prev) => !prev)}
                  sx={{ whiteSpace: "nowrap", minWidth: 130, py: 1.85 }}
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
                      {[linFilter, fscFilter, niinFilter, descFilter].filter((v) => v !== ALL).length}
                    </Box>
                  )}
                </Button>
              </Stack>

              <Collapse in={showFilters}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} flexWrap="wrap">
                  {[
                    { label: "LIN", id: "filter-lin", value: linFilter, options: linOptions, onChange: handleLinChange, minWidth: 140 },
                    { label: "FSC", id: "filter-fsc", value: fscFilter, options: fscOptions, onChange: handleFscChange, minWidth: 140 },
                    { label: "NIIN", id: "filter-niin", value: niinFilter, options: niinOptions, onChange: handleNiinChange, minWidth: 180 },
                    { label: "Description", id: "filter-desc", value: descFilter, options: descOptions, onChange: handleDescChange, minWidth: 220, flex: 1 },
                  ].map(({ label, id, value, options, onChange, minWidth, flex }) => (
                    <TextField
                      key={label}
                      select
                      label={label}
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      size="small"
                      inputProps={{ id, name: id }}
                      sx={{ minWidth: { xs: "100%", sm: minWidth }, ...(flex ? { flex } : {}) }}
                    >
                      {options.map((v) => (
                        <MenuItem key={v} value={v}>
                          {v}
                        </MenuItem>
                      ))}
                    </TextField>
                  ))}
                </Stack>
              </Collapse>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
                spacing={2}
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    SHOW
                  </Typography>
                  <ToggleButtonGroup
                    value={verificationFilter}
                    exclusive
                    onChange={(_e, val) => { if (val !== null) setVerificationFilter(val); }}
                    size="small"
                  >
                    <ToggleButton value={VERIFICATION_ALL} sx={{ px: 2 }}>
                      All
                    </ToggleButton>
                    <ToggleButton
                      value={VERIFICATION_NEEDED}
                      sx={{
                        px: 2,
                        color: "error.main",
                        "&.Mui-selected": { backgroundColor: "error.main", color: "white", "&:hover": { backgroundColor: "error.dark" } },
                      }}
                    >
                      <ErrorOutlineIcon sx={{ fontSize: 16, mr: 0.5 }} />
                      Needs Inventory
                    </ToggleButton>
                    <ToggleButton
                      value={VERIFICATION_COMPLETE}
                      sx={{
                        px: 2,
                        color: "success.main",
                        "&.Mui-selected": { backgroundColor: "success.main", color: "white", "&:hover": { backgroundColor: "success.dark" } },
                      }}
                    >
                      <CheckCircleOutlineIcon sx={{ fontSize: 16, mr: 0.5 }} />
                      Completed
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

              {filteredGroups.length === 0 ? (
                <Stack alignItems="center" spacing={1} py={6}>
                  <SearchIcon sx={{ fontSize: 48, color: "text.disabled" }} />
                  <Typography variant="body1" color="text.secondary" fontWeight={500}>
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
                    "&::-webkit-scrollbar-thumb": { backgroundColor: "divider", borderRadius: 4 },
                  }}
                >
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr" },
                      gap: 2,
                      alignItems: "start",
                    }}
                  >
                    {filteredGroups.map((group) => (
                      <GroupedEndItemCard
                        key={group.key}
                        group={group}
                        onSerialClick={handleSerialClick}
                        selected={selectedGroup === group.representative.id}
                        seenBySerialId={seenBySerialId}

                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
