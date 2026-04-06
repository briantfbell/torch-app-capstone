import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function PdfModalViewer({ open, onClose, pdfUrl }) {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                BOM PDF
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ height: "80vh", p: 0 }}>
                <iframe
                    src={pdfUrl}
                    title="PDF Viewer"
                    width="100%"
                    height="100%"
                    style={{ border: "none" }}
                />
            </DialogContent>
        </Dialog>
    );
}