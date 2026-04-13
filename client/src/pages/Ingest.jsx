import Button from '@mui/material/Button';
import { useRef, useState } from 'react';

export default function Ingest() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [itemType, setItemType] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = e => {
    setFile(e.target.files[0]) || fileInputRef;
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
        setStatus('success');
        setErrorMessage(null);
        setFile(null);
        setItemType(null);
      } else {
        setStatus('fail');
        setErrorMessage(body.message || 'Upload failed.');
        setFile(null);
        setItemType(null);
      }
    } catch (err) {
      setStatus('fail');
      setErrorMessage(err.message || 'Upload failed.');
      setFile(null);
      setItemType(null);
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
        setItemType(null);
      } else {
        setStatus('fail');
        setErrorMessage(body.message || 'Upload failed.');
        setFile(null);
        setItemType(null);
      }
    } catch (err) {
      setStatus('fail');
      setErrorMessage(err.message || 'Upload failed.');
      setFile(null);
      setItemType(null);
    }
  };

  return (
    <div>
      {itemType === null && (
        <div>
          <Button
            variant="outlined"
            onClick={() => {
              setItemType('end-items');
              fileInputRef.current.value = null;
              fileInputRef.current.click();
              setErrorMessage(null);
            }}
          >
            Upload End Items
          </Button>

          <Button
            variant="outlined"
            onClick={() => {
              setItemType('components');
              fileInputRef.current.value = null;
              fileInputRef.current.click();
              setErrorMessage(null);
            }}
          >
            Upload Components
          </Button>
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {file && itemType === 'end-items' && (
        <Button
          variant="outlined"
          onClick={handleUploadEndItems}
          disabled={status === 'uploading'}
        >
          Upload
        </Button>
      )}

      {file && itemType === 'components' && (
        <Button
          variant="outlined"
          onClick={handleUploadComponents}
          disabled={status === 'uploading'}
        >
          Upload
        </Button>
      )}

      {status === 'success' && <p>Upload successful!</p>}
      {status === 'fail' && <p>{errorMessage}</p>}
      {status === 'uploading' && <p>Uploading...</p>}
    </div>
  );
}
