import { Dialog, DialogContent, DialogTitle, Button, Stack } from "@mui/material";

export default function PdfFillModal({ open, onClose, templateUrl, onUpload }) {

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    onUpload?.({
      file,
      url,
      name: file.name,
    });

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Fill Out 2062</DialogTitle>

      <DialogContent>
        <Stack spacing={2}>

          {/*native viewer*/}
          <iframe
            src={templateUrl}
            width="100%"
            height="600px"
            title="PDF Editor"
          />

          {/*how to*/}
          <div>
            1. Fill out the form above  
            2. Click download in the top right to save locally
            3. Upload that completed PDF below  
          </div>

          {/*uploadin*/}
          <Button variant="contained" component="label">
            Upload Completed PDF
            <input hidden type="file" accept="application/pdf" onChange={handleUpload} />
          </Button>

        </Stack>
      </DialogContent>
    </Dialog>
  );
}