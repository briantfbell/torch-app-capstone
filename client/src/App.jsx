import "./App.css";
import MainRouter from "./services/Router";
import MiniDrawer from "./components/ui/MiniDrawer.jsx";

function App() {
  return (
    <MiniDrawer>
      <MainRouter />
    </MiniDrawer>
  );
}

export default App;
