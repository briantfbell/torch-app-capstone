import {Box, Card, CardContent, Stack, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import {BarChart, PieChart, useDrawingArea} from '@mui/x-charts';
import ShortageDataGrid from '../components/dashboard/ShortageDataGrid.jsx';
import {useEffect, useState} from 'react';
import {tryGetEndItems, tryGetHistoryEndItems} from '../api/data.js';

const barChartSettings = {
    xAxis: [
        {
            label: '% On Hand',
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

const Dashboard = () => {
    const [endItems, setEndItems] = useState([]);
    const [historyEndItems, setHistoryEndItems] = useState([]);

    useEffect(() => {
        const getInitialData = async () => {
            const endItemList = await tryGetEndItems();
            setEndItems(endItemList.allEndItems ?? []);

            const historyList = await tryGetHistoryEndItems();
            setHistoryEndItems(historyList.currentHistory ?? []);
        };
        getInitialData();
    }, []);

    // Group history_end_current rows by end_item_id
    const historyByEndItem = historyEndItems.reduce((acc, row) => {
        if (!acc[row.end_item_id]) acc[row.end_item_id] = [];
        acc[row.end_item_id].push(row);
        return acc;
    }, {});

    // Completion derived from history count vs auth_qty (at or over auth_qty = complete)
    const completedTotal = endItems.filter(item =>
        (historyByEndItem[item.id] ?? []).length >= item.auth_qty
    ).length;
    const notCompletedTotal = endItems.length - completedTotal;
    const completedPercent = endItems.length > 0
        ? Math.floor((completedTotal / endItems.length) * 100)
        : 0;

    const pieCompletedData = [
        {value: completedTotal, label: 'Completed'},
        {value: notCompletedTotal, label: 'Not Complete'},
    ];

    // Shortages: end items where history count < auth_qty
    const shortEndItems = endItems.filter(item =>
        (historyByEndItem[item.id] ?? []).length < item.auth_qty
    );

    // Over: end items where history count > auth_qty
    const overEndItems = endItems.filter(item =>
        (historyByEndItem[item.id] ?? []).length > item.auth_qty
    );

    // Total shortage value: missing qty * unit cost per short end item
    const totalShortageValue = shortEndItems.reduce((sum, item) => {
        const count = (historyByEndItem[item.id] ?? []).length;
        const shortQty = item.auth_qty - count;
        return sum + shortQty * (parseFloat(item.cost) || 0);
    }, 0);

    const formattedShortageValue = totalShortageValue.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    // Bar chart: % on hand per end item type
    const shortageDataset = endItems.map(item => ({
        name: `${item.niin} | ${(item.description ?? '').slice(0, 6)}`,
        percent: item.auth_qty > 0
            ? Math.floor(((historyByEndItem[item.id] ?? []).length / item.auth_qty) * 100)
            : 0,
    }));

    // DataGrid rows: short and over end items with delta qty and status
    const statusRows = [...shortEndItems, ...overEndItems].map((item, idx) => {
        const count = (historyByEndItem[item.id] ?? []).length;
        const delta = count - item.auth_qty; // negative = short, positive = over
        const status = delta < 0 ? 'SHORT' : 'OVER';
        const nsn = item.fsc ? `${item.fsc}-${item.niin}` : item.niin;
        return {
            id: idx + 1,
            name: item.description ?? item.niin,
            fsc: item.fsc ?? '—',
            lin: item.lin ?? '—',
            niin: item.niin,
            nsn,
            auth_qty: item.auth_qty,
            qty: delta,
            value: Math.abs(delta) * (parseFloat(item.cost) || 0),
            status,
        };
    });

    return (
        <Box sx={{mx: 'auto', width: '100%'}}>
            <Stack spacing={3}>
                <Card
                    elevation={0}
                    sx={{
                        borderRadius: 4,
                        border: '1px solid',
                        borderColor: 'divider',
                    }}
                >
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
                                    <Typography variant="overline" color="primary" fontWeight={700}>
                                        Metrics Dashboard
                                    </Typography>
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
                        sx={{
                            borderRadius: 4,
                            border: '1px solid',
                            borderColor: 'divider',
                            flexGrow: 2,
                        }}
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
                                                yAxis={[
                                                    {scaleType: 'band', dataKey: 'name', width: 150},
                                                ]}
                                                series={[
                                                    {
                                                        dataKey: 'percent',
                                                        valueFormatter: value => `${value}%`,
                                                        barLabel: v => `${v.value}%`,
                                                    },
                                                ]}
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
                        sx={{
                            borderRadius: 4,
                            border: '1px solid',
                            borderColor: 'divider',
                            flexGrow: 1,
                        }}
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

                                        <Stack
                                            direction={'column'}
                                            borderLeft={3}
                                            borderColor={'red'}
                                            paddingLeft={2}
                                            borderRadius={2}
                                        >
                                            <Typography variant={'overline'}>Total Shortage Value</Typography>
                                            <Typography variant={'h3'} color={'error'}>
                                                {formattedShortageValue}
                                            </Typography>
                                        </Stack>
                                        <ShortageDataGrid rows={statusRows}/>
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
