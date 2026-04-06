import { useNavigate } from "react-router-dom";

export default function EquipmentPage() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Equipment</h1>
      <button onClick={() => navigate("/shr-viewer")}>
        Sub Hand Receipt PDF
      </button>
    </div>
  );
}
