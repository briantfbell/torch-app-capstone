import {Box, Card, CardContent, Chip, Stack, Tab, Tabs, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import {BarChart, PieChart, useDrawingArea} from '@mui/x-charts';
import ShortageDataGrid from '../components/dashboard/ShortageDataGrid.jsx';
import {useQuery} from '@tanstack/react-query';
import {
    tryGetComponents,
    tryGetEndItems,
    tryGetHistoryComponent,
    tryGetHistoryEndItems,
    tryGetSerialComponents,
    tryGetSerialItems,
} from '../api/data.js';
import {useState} from 'react';

const barChartSettings = {
    xAxis: [
        {
            label: '% On Hand',
            max: 100,
            colorMap: {
                type: 'piecewise',
                thresholds: [50, 85],
                colors: ['#ff4e4e', '#ffaf00', '#59b600'],
            },
        },
    ],
    height: 300,
    width: 700,
};

const pieChartSize = {
    width: 250,
    height: 250,
};

const StyledText = styled('text')(({theme}) => ({
    fill: theme.palette.text.primary,
    textAnchor: 'middle',
    dominantBaseline: 'central',
    fontSize: 16,
}));

function PieCenterLabel({children}) {
    const {width, height, left, top} = useDrawingArea();
    return (
        <StyledText x={left + width / 2} y={top + height / 2}>
            {children}%
        </StyledText>
    );
}

const componentColumns = [
    {field: 'name', headerName: 'Component', flex: 1, minWidth: 200, editable: false},
    {field: 'niin', headerName: 'NIIN', flex: 1, editable: false},
    {field: 'end_item', headerName: 'Parent End Item', flex: 1, minWidth: 180, editable: false},
    {field: 'auth_qty', headerName: 'Auth Qty', type: 'number', flex: 1, editable: false},
    {field: 'on_hand', headerName: 'On Hand', type: 'number', flex: 1, editable: false},
    {
        field: 'qty',
        headerName: 'Delta',
        type: 'number',
        flex: 1,
        editable: false,
        renderCell: (params) => {
            const isOver = params.value > 0;
            const display = isOver ? `+${params.value}` : `${params.value}`;
            return (
                <Stack height="100%" justifyContent="center">
                    <Typography variant="body2" fontWeight={600} color={isOver ? 'info.main' : 'error.main'}>
                        {display}
                    </Typography>
                </Stack>
            );
        },
    },
    {
        field: 'status',
        headerName: 'Status',
        flex: 1,
        editable: false,
        renderCell: (params) => {
            const isOver = params.value === 'OVER';
            return (
                <Stack height="100%" justifyContent="center">
                    <Typography variant="body2" fontWeight={600} color={isOver ? 'info.main' : 'error.main'}>
                        {params.value}
                    </Typography>
                </Stack>
            );
        },
    },
    {
        field: 'value',
        headerName: 'Value ($)',
        type: 'number',
        flex: 1,
        editable: false,
        valueFormatter: (value) =>
            value?.toLocaleString('en-US', {style: 'currency', currency: 'USD'}),
    },
];

const Dashboard = () => {
    const [shortageTab, setShortageTab] = useState(0);

    const {data: endItemsData, dataUpdatedAt: endItemsUpdatedAt} = useQuery({
        queryKey: ['endItems'],
        queryFn: tryGetEndItems,
        refetchInterval: 5_000,
        select: d => d.allEndItems ?? [],
    });

    const {data: componentsData, dataUpdatedAt: componentsUpdatedAt} = useQuery({
        queryKey: ['components'],
        queryFn: tryGetComponents,
        refetchInterval: 5_000,
        select: d => d.allComponents ?? [],
    });

    const {data: serialEndItemsData, dataUpdatedAt: serialEndItemsUpdatedAt} = useQuery({
        queryKey: ['serialEndItems'],
        queryFn: tryGetSerialItems,
        refetchInterval: 5_000,
        select: d => d.allSerialItems ?? [],
    });

    const {data: historyEndData, dataUpdatedAt: historyEndUpdatedAt} = useQuery({
        queryKey: ['historyEndItems'],
        queryFn: tryGetHistoryEndItems,
        refetchInterval: 5_000,
        select: d => d.currentHistory ?? [],
    });

    const {data: componentHistoryData, dataUpdatedAt: componentHistoryUpdatedAt} = useQuery({
        queryKey: ['historyComponents'],
        queryFn: tryGetHistoryComponent,
        refetchInterval: 5_000,
        select: d => d.currentHistory ?? [],
    });

    const {data: serialComponentsData, dataUpdatedAt: serialComponentsUpdatedAt} = useQuery({
        queryKey: ['serialComponents'],
        queryFn: tryGetSerialComponents,
        refetchInterval: 5_000,
        select: d => d.allSerialComponentItems ?? [],
    });

    const endItems = endItemsData ?? [];
    const components = componentsData ?? [];
    const serialEndItems = serialEndItemsData ?? [];
    const historyEndItems = historyEndData ?? [];
    const componentHistory = componentHistoryData ?? [];
    const serialComponents = serialComponentsData ?? [];

    const lastUpdated = Math.max(
        endItemsUpdatedAt, componentsUpdatedAt, serialEndItemsUpdatedAt,
        historyEndUpdatedAt, componentHistoryUpdatedAt, serialComponentsUpdatedAt,
    );
    const lastUpdatedLabel = lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Loading...';

    const registeredEndSerialIds = {};
    const registeredEndSerialCount = {};
    serialEndItems.forEach(s => {
        if (!registeredEndSerialIds[s.end_item_id]) {
            registeredEndSerialIds[s.end_item_id] = new Set();
            registeredEndSerialCount[s.end_item_id] = 0;
        }
        registeredEndSerialIds[s.end_item_id].add(s.id);
        registeredEndSerialCount[s.end_item_id]++;
    });

    const historyEndByItem = {};
    historyEndItems.forEach(h => {
        if (!historyEndByItem[h.end_item_id]) historyEndByItem[h.end_item_id] = [];
        historyEndByItem[h.end_item_id].push(h);
    });

    const endItemOnHand = (item) => {
        const registered = registeredEndSerialIds[item.id] ?? new Set();
        const history = historyEndByItem[item.id] ?? [];
        return history.filter(h => registered.has(h.serial_number)).length;
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
        const registeredEndSerials = registeredEndSerialCount[comp.end_item_id] ?? 0;
        return registeredEndSerials > 0
            ? comp.auth_qty * registeredEndSerials
            : comp.auth_qty;
    };

    const componentOnHand = (comp) => {
        const registered = registeredComponentSerialIds[comp.id] ?? new Set();
        const history = historyByComponent[comp.id] ?? [];
        return history.filter(h => registered.has(h.serial_number) && h.seen).length;
    };

    const isEndItemComplete = (item) => {
        const auth = registeredEndSerialCount[item.id] ?? item.auth_qty;
        if (endItemOnHand(item) < auth) return false;
        const comps = componentsByEndItem[item.id] ?? [];
        if (comps.length > 0) {
            return comps.every(comp => componentOnHand(comp) >= componentAuthQty(comp));
        }
        return true;
    };

    const completedTotal = endItems.filter(isEndItemComplete).length;
    const notCompletedTotal = endItems.length - completedTotal;
    const completedPercent = endItems.length > 0
        ? Math.floor((completedTotal / endItems.length) * 100)
        : 0;

    const pieCompletedData = [
        {value: completedTotal, label: 'Completed'},
        {value: notCompletedTotal, label: 'Not Complete'},
    ];

    const endItemDelta = (item) => {
        const auth = registeredEndSerialCount[item.id] ?? item.auth_qty;
        return endItemOnHand(item) - auth;
    };

    const shortEndItems = endItems.filter(item => endItemDelta(item) < 0);
    const overEndItems = endItems.filter(item => endItemDelta(item) > 0);

    const totalEndItemShortageValue = shortEndItems.reduce((sum, item) => {
        const delta = endItemDelta(item); // negative
        return sum + Math.abs(delta) * (parseFloat(item.cost) || 0);
    }, 0);

    const formattedEndItemShortageValue = totalEndItemShortageValue.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
    });


    const shortageDataset = endItems.map(item => {
        const auth = registeredEndSerialCount[item.id] ?? item.auth_qty;
        const onHand = endItemOnHand(item);
        const endItemPercent = auth > 0 ? Math.min(Math.floor((onHand / auth) * 100), 100) : 0;
        const comps = componentsByEndItem[item.id] ?? [];
        let percent = endItemPercent;
        if (comps.length > 0 && endItemPercent === 100) {
            const totalAuth = comps.reduce((sum, comp) => sum + componentAuthQty(comp), 0);
            const totalOnHand = comps.reduce((sum, comp) => sum + componentOnHand(comp), 0);
            percent = totalAuth > 0 ? Math.min(Math.floor((totalOnHand / totalAuth) * 100), 100) : 0;
        }
        return {
            name: `${item.niin} | ${(item.description ?? '').slice(0, 6)}`,
            percent,
        };
    });


    const endItemById = endItems.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
    }, {});

    const endItemStatusRows = [...shortEndItems, ...overEndItems].map((item, idx) => {
        const auth = registeredEndSerialCount[item.id] ?? item.auth_qty;
        const onHand = endItemOnHand(item);
        const delta = onHand - auth;
        const nsn = item.fsc ? `${item.fsc}-${item.niin}` : item.niin;
        return {
            id: idx + 1,
            name: item.description ?? item.niin,
            fsc: item.fsc ?? '—',
            lin: item.lin ?? '—',
            niin: item.niin,
            nsn,
            auth_qty: auth,
            on_hand: onHand,
            qty: delta,
            value: Math.abs(delta) * (parseFloat(item.cost) || 0),
            status: delta < 0 ? 'SHORT' : 'OVER',
        };
    });

    const shortComponents = components.filter(comp =>
        componentOnHand(comp) < componentAuthQty(comp)
    );
    const overComponents = components.filter(comp =>
        componentOnHand(comp) > componentAuthQty(comp)
    );

    const totalComponentShortageValue = shortComponents.reduce((sum, comp) => {
        const auth = componentAuthQty(comp);
        const found = componentOnHand(comp);
        return sum + (auth - found) * (parseFloat(comp.cost) || 0);
    }, 0);

    const formattedComponentShortageValue = totalComponentShortageValue.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    const componentStatusRows = [...shortComponents, ...overComponents].map((comp, idx) => {
        const auth = componentAuthQty(comp);
        const found = componentOnHand(comp);
        const delta = found - auth;
        const parentItem = endItemById[comp.end_item_id];
        return {
            id: idx + 1,
            name: comp.description ?? comp.niin,
            niin: comp.niin,
            end_item: parentItem?.description ?? '—',
            auth_qty: auth,
            on_hand: found,
            qty: delta,
            value: Math.abs(delta) * (parseFloat(comp.cost) || 0),
            status: delta < 0 ? 'SHORT' : 'OVER',
        };
    });

    const shortageValue = shortageTab === 0 ? formattedEndItemShortageValue : formattedComponentShortageValue;
    const shortageRows = shortageTab === 0 ? endItemStatusRows : componentStatusRows;
    const shortageColumns = shortageTab === 0 ? undefined : componentColumns;

    return (
        <Box sx={{mx: 'auto', width: '100%'}}>
            <Stack spacing={3}>
                <Card elevation={0} sx={{borderRadius: 4, border: '1px solid', borderColor: 'divider'}}>
                    <CardContent sx={{p: {xs: 3, sm: 4}}}>
                        <Stack spacing={2}>
                            <Stack
                                direction={{xs: 'column', sm: 'row'}}
                                justifyContent="space-between"
                                alignItems={{xs: 'flex-start', sm: 'stretch'}}
                                spacing={2}
                                sx={{width: '100%'}}
                            >
                                <Stack spacing={1} sx={{width: '100%'}}>
                                    <Stack direction="row" alignItems="center" spacing={2}>
                                        <Typography variant="overline" color="primary" fontWeight={700}>
                                            Metrics Dashboard
                                        </Typography>
                                        <Chip
                                            label={`Last updated: ${lastUpdatedLabel}`}
                                            size="small"
                                            variant="outlined"
                                            color="primary"
                                        />
                                    </Stack>
                                    <Stack direction={'row'} spacing={2} sx={{width: '100%'}}>
                                        <Card sx={{flex: 1}}>
                                            <CardContent>
                                                <Typography variant={'h3'} color={'primary'}>
                                                    {completedPercent}%
                                                </Typography>
                                                <Typography>Inventory Completed</Typography>
                                            </CardContent>
                                        </Card>
                                        <Card sx={{flex: 1}}>
                                            <CardContent>
                                                <Typography variant={'h3'} color={'primary'}>
                                                    {endItems.length}
                                                </Typography>
                                                <Typography>No. End Items</Typography>
                                            </CardContent>
                                        </Card>
                                        <Card sx={{flex: 1}}>
                                            <CardContent>
                                                <Typography variant={'h3'} color={'error'}>
                                                    {shortEndItems.length}
                                                </Typography>
                                                <Typography>No. End Items w/ Shortages</Typography>
                                            </CardContent>
                                        </Card>
                                        <Card sx={{flex: 1}}>
                                            <CardContent>
                                                <Typography variant={'h3'} color={'info'}>
                                                    {overEndItems.length}
                                                </Typography>
                                                <Typography>No. End Items Over Auth Qty</Typography>
                                            </CardContent>
                                        </Card>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>

                <Stack direction={{xs: 'column', lg: 'row'}} spacing={2}>
                    <Card
                        elevation={0}
                        sx={{borderRadius: 4, border: '1px solid', borderColor: 'divider', flexGrow: 2}}
                    >
                        <CardContent sx={{p: {xs: 3, sm: 4}}}>
                            <Stack spacing={2}>
                                <Stack
                                    direction={{xs: 'column', sm: 'row'}}
                                    justifyContent="space-between"
                                    alignItems={{xs: 'flex-start', sm: 'center'}}
                                    spacing={2}
                                >
                                    <Stack spacing={5}>
                                        <Stack>
                                            <Typography variant="overline" color="primary" fontWeight={700}>
                                                Inventory Health
                                            </Typography>
                                            <Typography variant={'overline'}>
                                                Command-wide aggregate data
                                            </Typography>
                                        </Stack>
                                        <Stack direction={'column'} spacing={2}>
                                            <Typography variant={'overline'}>End Item Status</Typography>
                                            <PieChart
                                                series={[{data: pieCompletedData, innerRadius: 90}]}
                                                {...pieChartSize}
                                            >
                                                <PieCenterLabel>{completedPercent}</PieCenterLabel>
                                            </PieChart>
                                            <BarChart
                                                dataset={shortageDataset}
                                                yAxis={[{scaleType: 'band', dataKey: 'name', width: 150}]}
                                                series={[{
                                                    dataKey: 'percent',
                                                    valueFormatter: value => `${value}%`,
                                                    barLabel: v => `${v.value}%`,
                                                }]}
                                                layout="horizontal"
                                                {...barChartSettings}
                                            />
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                    <Card
                        elevation={0}
                        sx={{borderRadius: 4, border: '1px solid', borderColor: 'divider', flexGrow: 1}}
                    >
                        <CardContent sx={{p: {xs: 3, sm: 4}}}>
                            <Stack spacing={2}>
                                <Stack
                                    direction={{xs: 'column', sm: 'row'}}
                                    justifyContent="space-between"
                                    alignItems={{xs: 'flex-start', sm: 'center'}}
                                    spacing={2}
                                >
                                    <Stack spacing={2} width={'100%'} height={'100%'}>
                                        <Stack>
                                            <Typography variant="overline" color="primary" fontWeight={700}>
                                                Shortage Summary
                                            </Typography>
                                            <Typography variant={'overline'}>
                                                Outstanding acquisition requirements
                                            </Typography>
                                        </Stack>
                                        <Tabs
                                            value={shortageTab}
                                            onChange={(_, v) => setShortageTab(v)}
                                            variant="fullWidth"
                                            sx={{borderBottom: 1, borderColor: 'divider'}}
                                        >
                                            <Tab label="End Items"/>
                                            <Tab label="Components"/>
                                        </Tabs>
                                        <Stack
                                            direction={'column'}
                                            borderLeft={3}
                                            borderColor={'red'}
                                            paddingLeft={2}
                                            borderRadius={2}
                                        >
                                            <Typography variant={'overline'}>Total Shortage Value</Typography>
                                            <Typography variant={'h3'} color={'error'}>
                                                {shortageValue}
                                            </Typography>
                                        </Stack>
                                        <ShortageDataGrid rows={shortageRows} columns={shortageColumns}/>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                </Stack>
            </Stack>
        </Box>
    );
};

export default Dashboard;
