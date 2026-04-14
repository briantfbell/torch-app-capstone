import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import UploadFileIcon from '@mui/icons-material/UploadFile';

export default function IngestItems() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('initial');
  const [errorMessage, setErrorMessage] = useState(null);
  const [uics, setUics] = useState([]);

  const handleFileChange = e => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    let uicArry = [];
    fetch("http://localhost:8080/uics", { credentials: "include" })
      .then((res) => res.json())
      .then(data => data.allUics.map(i => uicArry.push(i.uic)))
      .then(empt => setUics(uicArry))
      .then(out => console.log(uicArry))
      .catch((err) => console.error("Failed to get UICs:", err));
  }, []);

  const handleUploadEndItems = async () => {
    console.log()
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
        setStatus('success');
        setErrorMessage(null);
        setFile(null);
      } else {
        setStatus('fail');
        setErrorMessage(body.message || 'Upload failed.');
        setFile(null);
      }
    } catch (err) {
      setStatus('fail');
      setErrorMessage(err.message || 'Upload failed.');
      setFile(null);
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
        setStatus('success');
        setErrorMessage(null);
        setFile(null);
      } else {
        setStatus('fail');
        setErrorMessage(body.message || 'Upload failed.');
        setFile(null);
      }
    } catch (err) {
      setStatus('fail');
      setErrorMessage(err.message || 'Upload failed.');
      setFile(null);
    }
  };

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  return (
    <div>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
          sx={{ alignSelf: "center", minWidth: 320 }}
        >
          Upload files
          <VisuallyHiddenInput
            type="file"
            onChange={handleFileChange}
            multiple
          />
        </Button>
        {file && (
          <section>
            File details:
            <ul>
              <li>Name: {file.name}</li>
              <li>Type: {file.type}</li>
              <li>Size: {file.size} bytes</li>
            </ul>
          </section>
        )}
        {status === 'success' && <p>Upload successful!</p>}
        {status === 'fail' && <p>{errorMessage}</p>}
        {status === 'uploading' && <p>Uploading...</p>}
          <Button
            variant="outlined"
            size="large"
            startIcon={<UploadFileIcon />}
            onClick={handleUploadEndItems}
            sx={{ alignSelf: "center", minWidth: 320 }}
          >
            End-Items
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<UploadFileIcon />}
            onClick={handleUploadComponents}
            sx={{ alignSelf: "center", minWidth: 320 }}
          >
            Components
          </Button>
        </Stack>
      </Container>
    </div>
  );
}
