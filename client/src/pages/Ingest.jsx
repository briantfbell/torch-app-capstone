import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';

const normalizeStr = str => String(str).toLowerCase().replace(/[\s_]/g, '');

export default function Ingest() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [itemType, setItemType] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [schemaColumns, setSchemaColumns] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetch('http://localhost:8080/ingest/schema', { credentials: 'include' })
      .then(res => res.json())
      .then(({ columns }) =>
        setSchemaColumns(new Set(columns.map(normalizeStr))),
      )
      .catch(() => {});
  }, []);

  const setFailureStates = body => {
    setStatus('fail');
    setErrorMessage(body.message || 'Upload failed.');
    setFile(null);
    setItemType(null);
    setPreviewData(null);
  };

  const setSuccessStates = () => {
    setStatus('success');
    setErrorMessage(null);
    setFile(null);
    setItemType(null);
    setPreviewData(null);
  };

  const clearAllStates = () => {
    setStatus(null);
    setErrorMessage(null);
    setFile(null);
    setItemType(null);
    setPreviewData(null);
  };

  const handleFileChange = e => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setStatus(null);

    // Browser API for reading local files as raw binary data
    const reader = new FileReader();

    // Fires once the file has been fully loaded into memory
    reader.onload = event => {
      // Convert the raw ArrayBuffer into bytes that XLSX can parse
      const data = new Uint8Array(event.target.result);

      // Parse the byte array into a workbook (contains all sheets)
      const workbook = XLSX.read(data, { type: 'array' });

      // Grab the first sheet by name
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      // Convert the sheet into a 2D array; row 0 will be the header row
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      if (rows.length > 0) {
        // Row 0 contains all column names from the spreadsheet
        const allHeaders = rows[0];

        // If a schema is loaded, keep only matching column indices; otherwise keep all
        const filteredIndices = schemaColumns
          ? allHeaders.reduce((acc, h, i) => {
              if (schemaColumns.has(normalizeStr(h))) acc.push(i);
              return acc;
            }, [])
          : allHeaders.map((_, i) => i);

        // Remap column names through the filtered indices
        const headers = filteredIndices.map(i => allHeaders[i]);

        // Take up to 5 data rows and pluck only the schema-matching columns
        const filteredRows = rows
          .slice(1, 6)
          .map(row => filteredIndices.map(i => row[i]));

        // Store headers + rows in state to render the preview table
        setPreviewData({ headers, rows: filteredRows });
      }
    };
    // Trigger the read — fires onload when complete
    reader.readAsArrayBuffer(selected);
  };

  const handleUploadEndItems = async () => {
    if (!file) return;

    setStatus('uploading');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8080/ingest/end-items', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const body = await response.json();

      if (response.ok) {
        setSuccessStates();
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
      const response = await fetch('http://localhost:8080/ingest/components', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const body = await response.json();

      if (response.ok) {
        setSuccessStates();
      } else {
        setFailureStates(body);
      }
    } catch (err) {
      setFailureStates(err);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".xlsx, .xls, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {itemType === null && (
        <div>
          <FormControl fullWidth>
            <InputLabel id="select-label">
              What kind of items are you uploading?
            </InputLabel>

            <Select
              labelId="select-label"
              id="select"
              value={itemType}
              label=""
              onChange={handleFileChange}
            >
              <MenuItem
                value={'components'}
                onClick={() => {
                  setItemType('components');
                  fileInputRef.current.value = null;
                  setErrorMessage(null);

                  // Create a listener for when the OS file picker closes,
                  window.addEventListener(
                    'focus',
                    () => {
                      // Small delay because focus fires
                      // before the browser updates the input's file list
                      setTimeout(() => {
                        // If no file was selected (user cancelled the picker), reset state
                        if (!fileInputRef.current?.files?.length) {
                          clearAllStates();
                        }
                      }, 100);
                    },

                    // auto-removes this listener after it fires
                    { once: true },
                  );

                  // lastly, actually click the selection
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
        </div>
      )}

      {file && itemType === 'end-items' && (
        <>
          <ButtonGroup variant="outlined" aria-label="component-button-group">
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
              variant="outlined"
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
          <ButtonGroup variant="outlined" aria-label="component-button-group">
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
              variant="outlined"
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
                      minWidth: '6rem',
                      maxWidth: '12rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
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

      {status === 'success' && <p>Upload successful!</p>}
      {status === 'fail' && <p>{errorMessage}</p>}
      {status === 'uploading' && <p>Uploading...</p>}
    </div>
  );
}
