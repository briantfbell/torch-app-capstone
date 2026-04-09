import { useState } from 'react';

export default function Ingest() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('initial');
  const [message, setMessage] = useState('');

  const handleFileChange = e => {
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
        credentials: 'include',
      });

      if (response.ok) {
        console.log(response);
        setStatus('success');
        setMessage(response.message);
      } else {
        console.log(response);
        setStatus('fail');
        setMessage(response.message);
      }
    } catch (error) {
      console.log(error);
      setStatus('fail');
      setMessage(error.message);
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
      {status === 'fail' && <p>{message}</p>}
      {status === 'uploading' && <p>{message}</p>}
    </div>
  );
}
