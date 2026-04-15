import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Button, Container, Stack } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';

export default function IngestItems({ uic }) {
  const { uicId } = uic ?? {};
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('initial');
  const [errorMessage, setErrorMessage] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [schemaColumns, setSchemaColumns] = useState(null);
  const fileInputRef = useRef(null);

  const setFailureStates = body => {
    setStatus('fail');
    setErrorMessage(body.message || 'Upload failed.');
    setFile(null);
    setPreviewData(null);
  };

  const setSuccessStates = () => {
    setStatus('success');
    setErrorMessage(null);
    setFile(null);
    setPreviewData(null);
  };

  const normalizeStr = str => String(str).toLowerCase().replace(/[\s_]/g, '');

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

      // Convert the sheet into an array; row 0 will be the header row
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

  useEffect(() => {
    fetch('http://localhost:8080/ingest/schema', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(({ columns }) =>
        setSchemaColumns(new Set(columns.map(normalizeStr))),
      )
      .catch(() => {});
  }, []);

  const handleUploadEndItems = async () => {
    if (!file) return;

    setStatus('uploading');
    const formData = new FormData();
    formData.append('file', file);

    const url = uic
      ? `http://localhost:8080/ingest/end-items?uic=${encodeURIComponent(uic)}`
      : 'http://localhost:8080/ingest/end-items';

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

    const url = uic
      ? `http://localhost:8080/ingest/components?uic=${encodeURIComponent(uic)}`
      : 'http://localhost:8080/ingest/components';

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
        setSuccessStates();
      } else {
        setFailureStates(body);
      }
    } catch (err) {
      setFailureStates(err);
    }
  };

  // const VisuallyHiddenInput = styled('input')({
  //   clip: 'rect(0 0 0 0)',
  //   clipPath: 'inset(50%)',
  //   height: 1,
  //   overflow: 'hidden',
  //   position: 'absolute',
  //   bottom: 0,
  //   left: 0,
  //   whiteSpace: 'nowrap',
  //   width: 1,
  // });

  return (
    <div>
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Button
            component="label"
            role={undefined}
            variant="outlined"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            sx={{ alignSelf: 'center', minWidth: 320 }}
          >
            Select file
            {/* hid this component because there was a React error about potentially infinitely rendering, feel free to bring it back */}
            {/* <VisuallyHiddenInput
              type="file"
              onChange={handleFileChange}
              ref={fileInputRef}
              accept=".xlsx, .xls, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              multiple
            /> */}
            <input
              style={{ display: 'none' }}
              type="file"
              onChange={handleFileChange}
              ref={fileInputRef}
              accept=".xlsx, .xls, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              // commenting out multiple since the current ingest/preview logic is setup for one file
              // multiple
            />
          </Button>

          <Stack textAlign={'center'}>
            {status === 'success' && <div>Upload successful!</div>}
            {status === 'fail' && <div>{errorMessage}</div>}
            {status === 'uploading' && <div>Uploading...</div>}
          </Stack>

          {file && (
            <div style={{ textAlign: 'center', margin: '0px' }}>
              {file.name}
            </div>
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

          <Stack
            alignItems="center"
            justifyContent="center"
            alignSelf="center"
            justifySelf="center"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: '1rem',
            }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<UploadFileIcon />}
              onClick={handleUploadComponents}
              sx={{ alignSelf: 'center', minWidth: 320 }}
            >
              Upload Components
            </Button>

            <Button
              variant="contained"
              size="large"
              startIcon={<UploadFileIcon />}
              onClick={handleUploadEndItems}
              sx={{ alignSelf: 'center', minWidth: 320 }}
            >
              Upload End-Items
            </Button>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
