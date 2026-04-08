import Box from '@mui/material/Box';
import {DataGrid} from '@mui/x-data-grid';

// For information on how to fill this with backend data: https://mui.com/x/api/data-grid/data-grid/

const columns = [
    {
        field: 'name',
        headerName: 'Item Name',
        width: 150,
        editable: false,
    },
    {
        field: 'nsn',
        headerName: 'NSN',
        width: 180,
        editable: false,
    },
    {
        field: 'qty',
        headerName: 'QTY',
        type: 'number',
        width: 110,
        editable: false,
    },
    {
        field: 'value',
        headerName: 'Value ($)',
        type: 'number',
        width: 110,
        editable: false,
    },
];

const rows = [
    { id: 1, name: 'AN/PRC-117G', nsn: '5820-01-598-1254', qty: 14, value: 12400},
    { id: 2, name: 'AN/PRC-118G', nsn: '5820-01-598-1276', qty: 11, value: 12341},
    { id: 3, name: 'AN/PRC-119G', nsn: '5820-01-598-1234', qty: 10, value: 45632},
    { id: 4, name: 'AN/PRC-112G', nsn: '5820-01-598-1253', qty: 16, value: 456754},
    { id: 5, name: 'AN/PRC-113G', nsn: '5820-01-598-1226', qty: 17, value: 72562},
    { id: 6, name: 'AN/PRC-114G', nsn: '5820-01-598-1274', qty: 19, value: 642968},
    { id: 1, name: 'AN/PRC-117G', nsn: '5820-01-598-1254', qty: 14, value: 12400},
    { id: 2, name: 'AN/PRC-118G', nsn: '5820-01-598-1276', qty: 11, value: 12341},
    { id: 3, name: 'AN/PRC-119G', nsn: '5820-01-598-1234', qty: 10, value: 45632},
    { id: 4, name: 'AN/PRC-112G', nsn: '5820-01-598-1253', qty: 16, value: 456754},
    { id: 5, name: 'AN/PRC-113G', nsn: '5820-01-598-1226', qty: 17, value: 72562},
    { id: 6, name: 'AN/PRC-114G', nsn: '5820-01-598-1274', qty: 19, value: 642968},
];

export default function ShortageDataGrid() {
    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
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
