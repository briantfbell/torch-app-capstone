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

    const isValidType =
      selected.name.endsWith('.xlsx') ||
      selected.name.endsWith('.xls') ||
      selected.name.endsWith('.csv') ||
      selected.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      selected.type === 'application/vnd.ms-excel' ||
      selected.type === 'text/csv';

    if (!isValidType) {
      setStatus('fail');
      setErrorMessage('Only .xlsx, .xls, and .csv files are accepted.');
      setFile(null);
      setItemType(null);
      setPreviewData(null);
      return;
    }

    setFile(selected);
    setStatus(null);

    const reader = new FileReader();
    reader.onload = event => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      if (rows.length > 0) {
        const allHeaders = rows[0];
        const filteredIndices = schemaColumns
          ? allHeaders.reduce((acc, h, i) => {
              if (schemaColumns.has(normalizeStr(h))) acc.push(i);
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
                Components
              </MenuItem>

              <MenuItem
                value={'end-items'}
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
