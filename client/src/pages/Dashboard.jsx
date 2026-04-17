import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { BarChart, PieChart, useDrawingArea } from "@mui/x-charts";
import ShortageDataGrid from "../components/dashboard/ShortageDataGrid.jsx";
import { useQuery } from "@tanstack/react-query";
import {
  tryGetComponents,
  tryGetEndItems,
  tryGetHistoryComponent,
  tryGetHistoryEndItems,
  tryGetSerialComponents,
  tryGetSerialItems,
} from "../api/data.js";
import { useState } from "react";

const StyledText = styled("text")(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: "middle",
  dominantBaseline: "central",
  fontSize: 16,
}));

const SectionHeader = ({ title, description }) => (
  <Stack spacing={0.75}>
    <Typography variant="h6" fontWeight={700}>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {description}
    </Typography>
  </Stack>
);

function PieCenterLabel({ children }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}%
    </StyledText>
  );
}

const componentColumns = [
  {
    field: "name",
    headerName: "Component",
    flex: 1,
    minWidth: 200,
    editable: false,
  },
  { field: "niin", headerName: "NIIN", flex: 1, editable: false },
  {
    field: "end_item",
    headerName: "Parent End Item",
    flex: 1,
    minWidth: 180,
    editable: false,
  },
  {
    field: "auth_qty",
    headerName: "Auth Qty",
    type: "number",
    flex: 1,
    editable: false,
  },
  {
    field: "on_hand",
    headerName: "On Hand",
    type: "number",
    flex: 1,
    editable: false,
  },
  {
    field: "qty",
    headerName: "Delta",
    type: "number",
    flex: 1,
    editable: false,
    renderCell: (params) => {
      const isOver = params.value > 0;
      const display = isOver ? `+${params.value}` : `${params.value}`;
      return (
        <Stack height="100%" justifyContent="center">
          <Typography
            variant="body2"
            fontWeight={600}
            color={isOver ? "info.main" : "error.main"}
          >
            {display}
          </Typography>
        </Stack>
      );
    },
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    editable: false,
    renderCell: (params) => {
      const isOver = params.value === "OVER";
      return (
        <Stack height="100%" justifyContent="center">
          <Typography
            variant="body2"
            fontWeight={600}
            color={isOver ? "info.main" : "error.main"}
          >
            {params.value}
          </Typography>
        </Stack>
      );
    },
  },
  {
    field: "value",
    headerName: "Value ($)",
    type: "number",
    flex: 1,
    editable: false,
    valueFormatter: (value) =>
      value?.toLocaleString("en-US", { style: "currency", currency: "USD" }),
  },
];

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [shortageTab, setShortageTab] = useState(0);

  const { data: endItemsData, dataUpdatedAt: endItemsUpdatedAt } = useQuery({
    queryKey: ["endItems"],
    queryFn: tryGetEndItems,
    refetchInterval: 5_000,
    select: (d) => d.allEndItems ?? [],
  });

  const { data: componentsData, dataUpdatedAt: componentsUpdatedAt } = useQuery(
    {
      queryKey: ["components"],
      queryFn: tryGetComponents,
      refetchInterval: 5_000,
      select: (d) => d.allComponents ?? [],
    },
  );

  const { data: serialEndItemsData, dataUpdatedAt: serialEndItemsUpdatedAt } =
    useQuery({
      queryKey: ["serialEndItems"],
      queryFn: tryGetSerialItems,
      refetchInterval: 5_000,
      select: (d) => d.allSerialEndItems ?? [],
    });

  const { data: historyEndData, dataUpdatedAt: historyEndUpdatedAt } = useQuery(
    {
      queryKey: ["historyEndItems"],
      queryFn: tryGetHistoryEndItems,
      refetchInterval: 5_000,
      select: (d) => d.currentHistory ?? [],
    },
  );

  const {
    data: componentHistoryData,
    dataUpdatedAt: componentHistoryUpdatedAt,
  } = useQuery({
    queryKey: ["historyComponents"],
    queryFn: tryGetHistoryComponent,
    refetchInterval: 5_000,
    select: (d) => d.currentHistory ?? [],
  });

  const {
    data: serialComponentsData,
    dataUpdatedAt: serialComponentsUpdatedAt,
  } = useQuery({
    queryKey: ["serialComponents"],
    queryFn: tryGetSerialComponents,
    refetchInterval: 5_000,
    select: (d) => d.allSerialComponents ?? [],
  });

  const endItems = endItemsData ?? [];
  const components = componentsData ?? [];
  const serialEndItems = serialEndItemsData ?? [];
  const historyEndItems = historyEndData ?? [];
  const componentHistory = componentHistoryData ?? [];
  const serialComponents = serialComponentsData ?? [];

  const lastUpdated = Math.max(
    endItemsUpdatedAt,
    componentsUpdatedAt,
    serialEndItemsUpdatedAt,
    historyEndUpdatedAt,
    componentHistoryUpdatedAt,
    serialComponentsUpdatedAt,
  );
  const lastUpdatedLabel = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString()
    : "Loading...";

  const registeredEndSerialIds = {};
  const registeredEndSerialCount = {};
  serialEndItems.forEach((s) => {
    if (!registeredEndSerialIds[s.end_item_id]) {
      registeredEndSerialIds[s.end_item_id] = new Set();
      registeredEndSerialCount[s.end_item_id] = 0;
    }
    registeredEndSerialIds[s.end_item_id].add(s.id);
    registeredEndSerialCount[s.end_item_id]++;
  });

  const historyEndByItem = {};
  historyEndItems.forEach((h) => {
    if (!historyEndByItem[h.end_item_id]) historyEndByItem[h.end_item_id] = [];
    historyEndByItem[h.end_item_id].push(h);
  });

  const endItemOnHand = (item) => {
    const registered = registeredEndSerialIds[item.id] ?? new Set();
    const history = historyEndByItem[item.id] ?? [];
    return history.filter((h) => registered.has(h.serial_number) && h.seen).length;
  };

  const componentsByEndItem = components.reduce((acc, comp) => {
    if (!acc[comp.end_item_id]) acc[comp.end_item_id] = [];
    acc[comp.end_item_id].push(comp);
    return acc;
  }, {});

  const historyByComponent = componentHistory.reduce((acc, row) => {
    if (!acc[row.component_id]) acc[row.component_id] = [];
    acc[row.component_id].push(row);
    return acc;
  }, {});

  const registeredComponentSerialIds = serialComponents.reduce((acc, s) => {
    if (!acc[s.component_id]) acc[s.component_id] = new Set();
    acc[s.component_id].add(s.id);
    return acc;
  }, {});

  const componentAuthQty = (comp) => {
    const registeredEndSerials =
      registeredEndSerialCount[comp.end_item_id] ?? 0;
    return registeredEndSerials > 0
      ? comp.auth_qty * registeredEndSerials
      : comp.auth_qty;
  };

  const componentOnHand = (comp) => {
    const registeredSerials = registeredEndSerialIds[comp.end_item_id] ?? new Set();
    const history = historyByComponent[comp.id] ?? [];
    const relevant = registeredSerials.size > 0
      ? history.filter((h) => registeredSerials.has(h.serial_number) && h.seen)
      : history.filter((h) => h.seen);
    return relevant.reduce((sum, h) => sum + (Number(h.count) || 0), 0);
  };

  const isEndItemComplete = (item) => {
    const auth = registeredEndSerialCount[item.id] ?? item.auth_qty;
    return endItemOnHand(item) >= auth;
  };

  const completedTotal = endItems.filter(isEndItemComplete).length;
  const notCompletedTotal = endItems.length - completedTotal;
  const completedPercent =
    endItems.length > 0
      ? Math.floor((completedTotal / endItems.length) * 100)
      : 0;

  const pieCompletedData = [
    { value: completedTotal, label: "Completed" },
    { value: notCompletedTotal, label: "Not Complete" },
  ];

  const endItemDelta = (item) => {
    const auth = registeredEndSerialCount[item.id] ?? item.auth_qty;
    return endItemOnHand(item) - auth;
  };

  const shortEndItems = endItems.filter((item) => endItemDelta(item) < 0);
  const overEndItems = endItems.filter((item) => endItemDelta(item) > 0);

  const totalEndItemShortageValue = shortEndItems.reduce((sum, item) => {
    const delta = endItemDelta(item); // negative
    return sum + Math.abs(delta) * (parseFloat(item.cost) || 0);
  }, 0);

  const formattedEndItemShortageValue =
    totalEndItemShortageValue.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

  const shortageDataset = endItems.map((item) => {
    const auth = registeredEndSerialCount[item.id] ?? item.auth_qty;
    const onHand = endItemOnHand(item);
    const percent =
      auth > 0 ? Math.min(Math.floor((onHand / auth) * 100), 100) : 0;
    return {
      name: (item.description ?? "").slice(0, 35),
      percent,
    };
  });

  const endItemById = endItems.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});

  const endItemStatusRows = [...shortEndItems, ...overEndItems].map(
    (item, idx) => {
      const auth = registeredEndSerialCount[item.id] ?? item.auth_qty;
      const onHand = endItemOnHand(item);
      const delta = onHand - auth;
      const nsn = item.fsc ? `${item.fsc}-${item.niin}` : item.niin;
      return {
        id: idx + 1,
        name: item.description ?? item.niin,
        fsc: item.fsc ?? "—",
        lin: item.lin ?? "—",
        niin: item.niin,
        nsn,
        auth_qty: auth,
        on_hand: onHand,
        qty: delta,
        value: Math.abs(delta) * (parseFloat(item.cost) || 0),
        status: delta < 0 ? "SHORT" : "OVER",
      };
    },
  );

  const shortComponents = components.filter(
    (comp) => componentOnHand(comp) < componentAuthQty(comp),
  );
  const overComponents = components.filter(
    (comp) => componentOnHand(comp) > componentAuthQty(comp),
  );

  const totalComponentShortageValue = shortComponents.reduce((sum, comp) => {
    const auth = componentAuthQty(comp);
    const found = componentOnHand(comp);
    return sum + (auth - found) * (parseFloat(comp.cost) || 0);
  }, 0);

  const formattedComponentShortageValue =
    totalComponentShortageValue.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

  const componentStatusRows = [...shortComponents, ...overComponents].map(
    (comp, idx) => {
      const auth = componentAuthQty(comp);
      const found = componentOnHand(comp);
      const delta = found - auth;
      const parentItem = endItemById[comp.end_item_id];
      return {
        id: idx + 1,
        name: comp.description ?? comp.niin,
        niin: comp.niin,
        end_item: parentItem?.description ?? "—",
        auth_qty: auth,
        on_hand: found,
        qty: delta,
        value: Math.abs(delta) * (parseFloat(comp.cost) || 0),
        status: delta < 0 ? "SHORT" : "OVER",
      };
    },
  );

  const shortageValue =
    shortageTab === 0
      ? formattedEndItemShortageValue
      : formattedComponentShortageValue;
  const shortageRows =
    shortageTab === 0 ? endItemStatusRows : componentStatusRows;
  const shortageColumns = shortageTab === 0 ? undefined : componentColumns;
  const chartHeight = isTablet ? 360 : 300;
  const pieChartSize = {
    width: isTablet ? 220 : 250,
    height: isTablet ? 220 : 250,
  };
  const barChartSettings = {
    xAxis: [
      {
        label: "% On Hand",
        max: 100,
        colorMap: {
          type: "piecewise",
          thresholds: [50, 85],
          colors: ["#ff4e4e", "#ffaf00", "#59b600"],
        },
      },
    ],
    height: chartHeight,
  };
  const summaryCards = [
    {
      value: `${completedPercent}%`,
      label: "Inventory Completed",
      color: "primary",
    },
    {
      value: endItems.length,
      label: "Total End Items",
      color: "primary",
    },
    {
      value: shortEndItems.length,
      label: "End Items w/ Shortages",
      color: "error",
    },
    {
      value: overEndItems.length,
      label: "End Items Over Auth Qty",
      color: "info",
    },
  ];

  return (
    <Box sx={{ maxWidth: 1500, mx: "auto", width: "100%" }}>
      <Stack spacing={3}>
        <Card
          elevation={0}
          sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider" }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Stack spacing={3}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={2}
              >
                <Stack spacing={1}>
                  <Typography variant="overline" color="primary" fontWeight={700}>
                    Inventory Dashboard
                  </Typography>
                  <Typography variant="h4" fontWeight={800}>
                    Unit Readiness Overview
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Live inventory status across all end items and components.
                  </Typography>
                </Stack>
                <Chip
                  label={`Updated: ${lastUpdatedLabel}`}
                  size="small"
                  variant="outlined"
                  color="primary"
                  sx={{ alignSelf: { xs: "flex-start", sm: "center" } }}
                />
              </Stack>

              <Divider />

              <Box
                sx={{
                  display: "grid",
                  gap: 2,
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, minmax(0, 1fr))",
                    lg: "repeat(4, minmax(0, 1fr))",
                  },
                }}
              >
                {summaryCards.map(({ value, label, color }) => (
                  <Card
                    key={label}
                    elevation={0}
                    sx={{
                      minWidth: 0,
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                      <Typography variant="h3" color={color} fontWeight={700}>
                        {value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {label}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card
          elevation={0}
          sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider" }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Stack spacing={3}>
              <SectionHeader
                title="Completion Rate"
                description="Inventory completion per end item. A lower percentage may indicate shortages or incomplete inventory."
              />

              <Divider />

              <Stack
                direction={{ xs: "column", lg: "row" }}
                spacing={3}
                alignItems={{ xs: "stretch", lg: "flex-start" }}
              >
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    width: { xs: "100%", lg: "auto" },
                    minWidth: 0,
                    overflow: "hidden",
                    py: { xs: 1, lg: 0 },
                  }}
                >
                  <PieChart
                    colors={["#59b600", "#ff4e4e"]}
                    series={[{ data: pieCompletedData, innerRadius: 90 }]}
                    {...pieChartSize}
                  >
                    <PieCenterLabel>{completedPercent}</PieCenterLabel>
                  </PieChart>
                </Stack>
                <Box sx={{ flex: 1, minWidth: 0, width: "100%", overflow: "hidden" }}>
                  <BarChart
                    width={undefined}
                    dataset={shortageDataset}
                    yAxis={[
                      {
                        scaleType: "band",
                        dataKey: "name",
                        width: isTablet ? 110 : 150,
                      },
                    ]}
                    series={[
                      {
                        dataKey: "percent",
                        valueFormatter: (value) => `${value}%`,
                        barLabel: (v) => `${v.value}%`,
                      },
                    ]}
                    layout="horizontal"
                    {...barChartSettings}
                  />
                </Box>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Card
          elevation={0}
          sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider" }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Stack spacing={3}>
              <SectionHeader
                title="Shortage Summary"
                description="Items and components below authorized quantity."
              />

              <Divider />

              <Tabs
                value={shortageTab}
                onChange={(_, v) => setShortageTab(v)}
                variant="fullWidth"
                sx={{ borderBottom: 1, borderColor: "divider" }}
              >
                <Tab label="End Items" />
                <Tab label="Components" />
              </Tabs>

              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "error.main",
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Shortage Value
                  </Typography>
                  <Typography variant="h4" fontWeight={800} color="error">
                    {shortageValue}
                  </Typography>
                </CardContent>
              </Card>

              <ShortageDataGrid rows={shortageRows} columns={shortageColumns} />
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default Dashboard;
