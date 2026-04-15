import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';

export default function IngestItems({ uic }) {
  const { uicId } = uic ?? {};
  const [file, setFile] = useState(null);
  const [itemType, setItemType] = useState(null);
  const [status, setStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [previewData, setPreviewData] = useState(null);
  const [schemaColumns, setSchemaColumns] = useState(null);
  const fileInputRef = useRef(null);

  const setFailureStates = body => {
    setStatus('fail');
    setErrorMessage(body.message || 'Upload failed.');
    setWarnings([]);
    setFile(null);
    setItemType(null);
    setPreviewData(null);
  };

  const setSuccessStates = (body = {}) => {
    if (body.warnings?.length) {
      setStatus('partial');
      setWarnings(body.warnings);
    } else {
      setStatus('success');
      setWarnings([]);
    }
    setErrorMessage(null);
    setFile(null);
    setItemType(null);
    setPreviewData(null);
  };

  const clearAllStates = () => {
    setStatus(null);
    setErrorMessage(null);
    setWarnings([]);
    setFile(null);
    setItemType(null);
    setPreviewData(null);
  };

  const normalizeStr = str => String(str).toLowerCase().replace(/[\s_]/g, '');

  const handleFileChange = e => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setStatus(null);

    const reader = new FileReader();

    reader.onload = event => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      if (rows.length > 0) {
        // Row 0 contains all column names from the spreadsheet
        const allHeaders = rows[0];

        const isXS = window.matchMedia('(max-width: 640px)').matches;
        const ALWAYS_HIDE = new Set(['stock', 'img', 'unitofmeasure']);
        const XS_HIDE = new Set(['fsc', 'material']);

        // If a schema is loaded, keep only matching column indices; otherwise keep all
        const filteredIndices = schemaColumns
          ? allHeaders.reduce((acc, h, i) => {
              const normalized = normalizeStr(h);

              // 1. Never preview these columns
              if (ALWAYS_HIDE.has(normalized)) return acc;

              // 2. Hide these only on xs screens
              if (isXS && XS_HIDE.has(normalized)) return acc;

              // 3. Schema filtering
              if (schemaColumns && !schemaColumns.has(normalized)) return acc;

              acc.push(i);
              return acc;
            }, [])
          : allHeaders.map((_, i) => i);

        const headers = filteredIndices.map(i => allHeaders[i]);
        const filteredRows = rows
          .slice(1, 6)
          .map(row => filteredIndices.map(i => row[i]));

        setPreviewData({ headers, rows: filteredRows });
      }
    };

    reader.readAsArrayBuffer(selected);
  };

  useEffect(() => {
    fetch('http://localhost:8080/ingest/schema', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(({ columns }) => {
        setSchemaColumns(new Set(columns.map(normalizeStr)));
      })
      .catch(() => {});
  }, []);

  const handleUpload = async () => {
    if (!file) return;

    setStatus('uploading');
    const formData = new FormData();
    formData.append('file', file);

    const endpoint =
      itemType === 'end-items'
        ? `http://localhost:8080/ingest/end-items/${uicId}`
        : `http://localhost:8080/ingest/components/${uicId}`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const body = await response.json();

      if (response.ok) {
        setSuccessStates(body);
      } else {
        setFailureStates(body);
      }
    } catch (err) {
      setFailureStates(err);
    }
  };

  return (
    <Stack spacing={3}>
      <input
        style={{ display: 'none' }}
        type="file"
        onChange={handleFileChange}
        accept=".xlsx, .xls, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        ref={fileInputRef}
      />

      {itemType === null && (
        <FormControl sx={{ width: '100%', alignSelf: 'center' }}>
          <InputLabel id="item-type-label">
            What kind of items are you uploading?
          </InputLabel>
          <Select
            labelId="item-type-label"
            id="item-type-select"
            value={itemType ?? ''}
            label="What kind of items are you uploading?"
            onChange={() => {}}
          >
            <MenuItem
              value="components"
              onClick={() => {
                setItemType('components');
                fileInputRef.current.value = null;
                setErrorMessage(null);

                window.addEventListener(
                  'focus',
                  () => {
                    setTimeout(() => {
                      if (!fileInputRef.current?.files?.length) {
                        clearAllStates();
                      }
                    }, 100);
                  },
                  { once: true },
                );

                fileInputRef.current.click();
              }}
            >
              Components
            </MenuItem>

            <MenuItem
              value="end-items"
              onClick={() => {
                setItemType('end-items');
                fileInputRef.current.value = null;
                setErrorMessage(null);

                window.addEventListener(
                  'focus',
                  () => {
                    setTimeout(() => {
                      if (!fileInputRef.current?.files?.length) {
                        setItemType(null);
                        setErrorMessage(null);
                      }
                    }, 300);
                  },
                  { once: true },
                );

                fileInputRef.current.click();
              }}
            >
              End Items
            </MenuItem>
          </Select>
        </FormControl>
      )}

      {status === 'success' && (
        <Alert severity="success" onClose={clearAllStates}>
          Upload successful!
        </Alert>
      )}

      {status === 'fail' && (
        <Alert severity="error" onClose={clearAllStates}>
          {errorMessage}
        </Alert>
      )}

      {status === 'partial' && (
        <Alert severity="warning" onClose={clearAllStates}>
          <strong>Upload partially successful.</strong>
          <div style={{ margin: '4px 0 0', paddingLeft: 20 }}>
            {warnings.map((w, i) => (
              <div key={i}>{w}</div>
            ))}
          </div>
        </Alert>
      )}

      {previewData && (
        <Stack spacing={1}>
          <Typography
            variant="body2"
            color="text.secondary"
            fontWeight={600}
            sx={{
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontSize: '0.7rem',
            }}
          >
            File Preview (first 5 rows)
          </Typography>

          <Box
            sx={{
              overflowX: 'auto',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'action.hover' }}>
                    {previewData.headers.map((h, i) => (
                      <TableCell
                        key={i}
                        title={h}
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          color: 'text.secondary',
                          whiteSpace: 'nowrap',
                          borderBottom: '2px solid',
                          borderColor: 'divider',
                          py: 1.5,
                          px: 2,
                        }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {previewData.rows.map((row, i) => (
                    <TableRow
                      key={i}
                      hover
                      sx={{ '&:last-child td': { borderBottom: 0 } }}
                    >
                      {row.map((cell, j) => (
                        <TableCell
                          key={j}
                          title={cell ?? ''}
                          sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: 160,
                            py: 1.25,
                            px: 2,
                            fontSize: '0.85rem',
                          }}
                        >
                          {cell ?? (
                            <Typography variant="caption" color="text.disabled">
                              —
                            </Typography>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Stack>
      )}

      {file && (
        <Stack spacing={1} alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Selected file:{' '}
            <Typography component="span" variant="body2" fontWeight={600}>
              {file.name}
            </Typography>
          </Typography>
          <ButtonGroup variant="outlined" aria-label="upload-button-group">
            <Button onClick={clearAllStates} disabled={status === 'uploading'}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleUpload}
              loading={status === 'uploading'}
              loadingPosition="start"
            >
              {status === 'uploading' ? 'Uploading...' : 'Upload'}
            </Button>
          </ButtonGroup>
        </Stack>
      )}
    </Stack>
  );
}
