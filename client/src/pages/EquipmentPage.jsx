import { useNavigate } from "react-router-dom";

export default function EquipmentPage() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Equipment</h1>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
        }}
      >
        <button onClick={() => navigate("/shr-viewer")}>
          Sub Hand Receipt PDF
        </button>
      </div>
    </div>
  );
}
