import Box from '@mui/material/Box';
import {DataGrid} from '@mui/x-data-grid';
import {Stack, Typography} from '@mui/material';

const columns = [
    {
        field: 'name',
        headerName: 'Item Name',
        flex: 1,
        editable: false,
    },
    {
        field: 'fsc',
        headerName: 'FSC',
        flex: 1,
        editable: false,
    },
    {
        field: 'lin',
        headerName: 'LIN',
        flex: 1,
        editable: false,
    },
    {
        field: 'niin',
        headerName: 'NIIN',
        flex: 1,
        editable: false,
    },
    {
        field: 'nsn',
        headerName: 'NSN',
        flex: 1,
        editable: false,
    },
    {
        field: 'auth_qty',
        headerName: 'Auth Qty',
        type: 'number',
        flex: 1,
        editable: false,
    },
    {
        field: 'on_hand',
        headerName: 'On Hand',
        type: 'number',
        flex: 1,
        editable: false,
    },
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
                    <Typography
                        variant="body2"
                        fontWeight={600}
                        color={isOver ? 'info.main' : 'error.main'}
                    >
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
                    <Typography
                        variant="body2"
                        fontWeight={600}
                        color={isOver ? 'info.main' : 'error.main'}
                    >
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

export default function ShortageDataGrid({rows = [], columns: columnsProp}) {
    const resolvedColumns = columnsProp ?? columns;
    return (
        <Box sx={{height: 400, width: '100%'}}>
            <DataGrid
                rows={rows}
                columns={resolvedColumns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                }}
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
                sx={{border: 'none'}}
            />
        </Box>
    );
}
