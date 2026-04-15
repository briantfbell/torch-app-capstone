import {
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
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

    try {
      const response = await fetch(
        `http://localhost:8080/ingest/end-items/${uicId}`,
        {
          method: 'POST',
          credentials: 'include',
          body: formData,
        },
      );

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

  const handleUploadComponents = async () => {
    if (!file) return;

    setStatus('uploading');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(
        `http://localhost:8080/ingest/components/${uicId}`,
        {
          method: 'POST',
          credentials: 'include',
          body: formData,
        },
      );

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
    <div>
      <Container maxWidth="lg">
        <Stack spacing={3} alignItems="center" justifyContent="center">
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
                  value={'end-items'}
                  onClick={() => {
                    setItemType('end-items');
                    fileInputRef.current.value = null;
                    setErrorMessage(null);
                    // same as above
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

          <Stack textAlign={'center'} spacing={1}>
            {status === 'success' && <div>Upload successful!</div>}
            {status === 'fail' && <div>{errorMessage}</div>}
            {status === 'uploading' && <div>Uploading...</div>}
            {status === 'partial' && (
              <div>
                <div>Upload partially successful.</div>
                <div style={{ textAlign: 'center', marginTop: 8 }}>
                  {warnings.map((w, i) => (
                    <div key={i} style={{ whiteSpace: 'pre-line' }}>
                      {w}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Stack>

          {file && (
            <div style={{ textAlign: 'center', margin: '0px' }}>
              {file.name}
            </div>
          )}

          {file && itemType === 'end-items' && (
            <>
              <ButtonGroup
                variant="outlined"
                aria-label="component-button-group"
              >
                <Button
                  variant="outlined"
                  onClick={() => {
                    clearAllStates();
                  }}
                  disabled={status === 'uploading'}
                >
                  Cancel
                </Button>

                <Button
                  variant="contained"
                  onClick={handleUploadEndItems}
                  loading={status === 'uploading'}
                  loadingPosition={'start'}
                >
                  Upload
                </Button>
              </ButtonGroup>
            </>
          )}

          {file && itemType === 'components' && (
            <>
              <ButtonGroup
                variant="outlined"
                aria-label="component-button-group"
              >
                <Button
                  variant="outlined"
                  onClick={() => {
                    clearAllStates();
                  }}
                  disabled={status === 'uploading'}
                >
                  Cancel
                </Button>

                <Button
                  variant="contained"
                  onClick={handleUploadComponents}
                  loading={status === 'uploading'}
                  loadingPosition={'start'}
                >
                  Upload
                </Button>
              </ButtonGroup>
            </>
          )}

          {previewData && (
            <div
              style={{
                marginTop: 16,
                overflowX: 'auto',
                maxWidth: '100vw',
              }}
            >
              <table
                style={{
                  borderCollapse: 'collapse',
                  width: '100%',
                  tableLayout: 'fixed',
                }}
              >
                <thead>
                  <tr>
                    {previewData.headers.map((h, i) => (
                      <th
                        key={i}
                        style={{
                          border: '1px solid #ccc',
                          padding: '4px 8px',
                          width: 'fit-content',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          textAlign: 'center',
                        }}
                        title={h}
                      >
                        {h.toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.rows.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td
                          key={j}
                          style={{
                            border: '1px solid #ccc',
                            padding: '4px 8px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',

                            textAlign: 'center',
                          }}
                          title={cell ?? ''}
                        >
                          {cell ?? ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Stack>
      </Container>
    </div>
  );
}
