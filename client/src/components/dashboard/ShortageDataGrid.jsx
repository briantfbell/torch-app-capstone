import {useEffect, useMemo} from 'react';
import Box from '@mui/material/Box';
import {DataGrid, useGridApiRef} from '@mui/x-data-grid';
import {Stack, Typography} from '@mui/material';

const DEFAULT_COLUMN_WIDTH = 140;

const columns = [
    {
        field: 'name',
        headerName: 'Item Name',
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
    const apiRef = useGridApiRef();
    const resolvedColumns = useMemo(() => {
        const sourceColumns = columnsProp ?? columns;

        return sourceColumns.map((column) => ({
            ...column,
            flex: undefined,
            width: column.width ?? DEFAULT_COLUMN_WIDTH,
        }));
    }, [columnsProp]);

    useEffect(() => {
        const frameId = requestAnimationFrame(() => {
            apiRef.current.autosizeColumns({
                includeHeaders: true,
                includeOutliers: true,
                expand: false,
            });
        });

        return () => cancelAnimationFrame(frameId);
    }, [apiRef, resolvedColumns, rows]);

    return (
        <Box sx={{height: 400, width: '100%', overflowX: 'auto'}}>
            <DataGrid
                apiRef={apiRef}
                rows={rows}
                columns={resolvedColumns}
                autosizeOnMount
                autosizeOptions={{
                    includeHeaders: true,
                    includeOutliers: true,
                    expand: false,
                }}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                }}
                pageSizeOptions={[5, 10, 25, 50, 100]}
                disableRowSelectionOnClick
                sx={{border: 'none', width: '100%'}}
            />
        </Box>
    );
}
