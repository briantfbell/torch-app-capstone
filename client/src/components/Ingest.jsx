import { useState } from 'react';

export default function Ingest() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('initial');

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus('uploading');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8080/ingest/excel', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('fail');
      }
    } catch (error) {
      setStatus('fail');
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
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

      {file && <button onClick={handleUpload}>Upload the file</button>}

      {status === 'success' && <p>Upload successful!</p>}
      {status === 'fail' && <p>Upload failed.</p>}
      {status === 'uploading' && <p>Uploading...</p>}
    </div>
  );
};
