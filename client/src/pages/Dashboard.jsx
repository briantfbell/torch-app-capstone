import {Box, Card, CardContent, Stack, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import {BarChart, PieChart, useDrawingArea} from '@mui/x-charts';
import ShortageDataGrid from '../components/dashboard/ShortageDataGrid.jsx';
import {useEffect, useState} from 'react';
import {tryGetEndItems, tryGetSerialItems} from '../api/data.js';

// MOCK DATA

const mockPieData = [
  { value: 91, label: 'On Hand' },
  { value: 9, label: 'Expected' },
];

const mockShortageDataset = [
  {
    name: '688904280 | 09dZKz',
    percent: 98.0,
  },
  {
    name: '939787549 | vXGoej',
    percent: 84.0,
  },
  {
    name: '607077594 | c3drZu',
    percent: 56.0,
  },
  {
    name: '513184353 | F3VRnz',
    percent: 76.0,
  },
  {
    name: '251475425 | eIwb6z',
    percent: 20.0,
  },
  {
    name: '688908280 | 09dZKz',
    percent: 98.0,
  },
  {
    name: '931787549 | vXGoej',
    percent: 84.0,
  },
  {
    name: '607027597 | c3drZu',
    percent: 91.0,
  },
  {
    name: '513104314 | F3VRnz',
    percent: 76.0,
  },
  {
    name: '251474425 | eIwb6z',
    percent: 44.0,
  },
];

const barChartSettings = {
  xAxis: [
    {
      label: '% Complete',
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

const StyledText = styled('text')(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: 16,
}));

function PieCenterLabel({ children }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <>
      <StyledText x={left + width / 2} y={top + height / 2}>
        {children}%
      </StyledText>
    </>
  );
}

const Dashboard = () => {
  const [endItems, setEndItems] = useState([])
  const [serialItems, setSerialItems] = useState([])

  useEffect(() => {
    const getInitialData = async () => {
      const endItemList = await tryGetEndItems()
      setEndItems(endItemList.allEndItems ?? [])

      const serialItemList = await tryGetSerialItems()
      setSerialItems(serialItemList.allSerialItems ?? [])
    }
    getInitialData()
  }, []);

  console.log(endItems)

  const completedTotalPie = endItems.filter(item => item.completed).length;
  const notCompletedTotalPie = endItems.length - completedTotalPie;
  const completedPercentPie = Math.floor((completedTotalPie / endItems.length) * 100);

  const pieCompletedData = [{
    value: completedTotalPie, label: "Completed"
  }, {
    value: notCompletedTotalPie, label: "Not Complete"
  }]

  return (
    <>
      <Box sx={{ mx: 'auto', width: '100%' }}>
        <Stack spacing={3}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Stack spacing={2}>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  justifyContent="space-between"
                  alignItems={{ xs: 'flex-start', sm: 'stretch' }}
                  spacing={2}
                  sx={{ width: '100%' }}
                >
                  <Stack spacing={1} sx={{ width: '100%' }}>
                    <Typography
                      variant="overline"
                      color="primary"
                      fontWeight={700}
                    >
                      Metrics Dashboard
                    </Typography>
                    <Stack direction={'row'} spacing={2} sx={{ width: '100%' }}>
                      <Card sx={{ flex: 1 }}>
                        <CardContent>
                          <Typography variant={'h3'} color={'primary'}>
                            XX%
                          </Typography>
                          <Typography>Inventory Completed</Typography>
                        </CardContent>
                      </Card>
                      <Card sx={{ flex: 1 }}>
                        <CardContent>
                          <Typography variant={'h3'} color={'primary'}>
                            {endItems.length}
                          </Typography>
                          <Typography>No. End Items</Typography>
                        </CardContent>
                      </Card>
                      <Card sx={{ flex: 1 }}>
                        <CardContent>
                          <Typography variant={'h3'} color={'error'}>
                            ##
                          </Typography>
                          <Typography>Shortages</Typography>
                        </CardContent>
                      </Card>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
                flexGrow: 2,
              }}
            >
              <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                <Stack spacing={2}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    spacing={2}
                  >
                    <Stack spacing={5}>
                      <Stack>
                        <Typography
                          variant="overline"
                          color="primary"
                          fontWeight={700}
                        >
                          Inventory Health
                        </Typography>
                        <Typography variant={'overline'}>
                          Command-wide aggregate data
                        </Typography>
                      </Stack>

                      <Stack direction={'column'} spacing={2}>
                        {/*<PieChart*/}
                        {/*  series={[{ data: mockPieData, innerRadius: 90 }]}*/}
                        {/*  {...pieChartSize}*/}
                        {/*>*/}
                        {/*  <PieCenterLabel>*/}
                        {/*    {mockPieData[0].value}*/}
                        {/*  </PieCenterLabel>*/}
                        {/*</PieChart>*/}
                        <Typography variant={'overline'}>End Item Status</Typography>
                        <PieChart
                          series={[{ data: pieCompletedData, innerRadius: 90 }]}
                          {...pieChartSize}
                        >
                          <PieCenterLabel>
                            {completedPercentPie}
                          </PieCenterLabel>
                        </PieChart>
                        <BarChart
                          dataset={mockShortageDataset}
                          yAxis={[
                            { scaleType: 'band', dataKey: 'name', width: 150 },
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
              <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                <Stack spacing={2}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    spacing={2}
                  >
                    <Stack spacing={2} width={'100%'}>
                      <Stack>
                        <Typography
                          variant="overline"
                          color="primary"
                          fontWeight={700}
                        >
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
                        <Typography variant={'overline'}>
                          Total Shortage Value
                        </Typography>
                        <Typography variant={'h3'} color={'error'}>
                          $1,234,567.00
                        </Typography>
                      </Stack>
                      <ShortageDataGrid />
                    </Stack>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Stack>
      </Box>
    </>
  );
};

export default Dashboard;
