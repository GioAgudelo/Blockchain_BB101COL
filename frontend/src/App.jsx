import { NavLink, Route, HashRouter, Routes } from "react-router-dom";
import EmitirPage from "./pages/EmitirPage.jsx";
import CustodiaPage from "./pages/CustodiaPage.jsx";
import VerificarPage from "./pages/VerificarPage.jsx";
import "./App.css";

function App() {
  return (
    <HashRouter>
      <header className="topbar">
        <span className="brand">GENUINA</span>
        <nav>
          <NavLink to="/" end>
            Emitir pasaporte
          </NavLink>
          <NavLink to="/custodia">Registrar custodia</NavLink>
          <NavLink to="/verificar">Verificar esmeralda</NavLink>
        </nav>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<EmitirPage />} />
          <Route path="/custodia" element={<CustodiaPage />} />
          <Route path="/verificar" element={<VerificarPage />} />
        </Routes>
      </main>
    </HashRouter>
  );
}

export default App;
