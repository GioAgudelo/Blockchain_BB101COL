import { useEffect, useState } from "react";
import { cargarGemas, registrarCustodia } from "../lib/stellar.js";

const SIGUIENTE_ROL = {
  Minero: "Taller",
  Taller: "Comercializador",
};

export default function CustodiaPage() {
  const [gemas, setGemas] = useState([]);
  const [assetCode, setAssetCode] = useState("");
  const [estado, setEstado] = useState({ cargando: false, error: "", ok: "" });

  useEffect(() => {
    setGemas(cargarGemas());
  }, [estado.ok]);

  const gemaSeleccionada = gemas.find((g) => g.assetCode === assetCode);
  const poseedorActual = gemaSeleccionada?.custodia[gemaSeleccionada.custodia.length - 1];
  const siguienteRol = poseedorActual ? SIGUIENTE_ROL[poseedorActual.rol] : null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!siguienteRol) return;
    setEstado({ cargando: true, error: "", ok: "" });
    try {
      await registrarCustodia({ assetCode, siguienteRol });
      setEstado({ cargando: false, error: "", ok: `Custodia transferida a ${siguienteRol}.` });
    } catch (err) {
      setEstado({ cargando: false, error: err.message, ok: "" });
    }
  }

  return (
    <div>
      <h1>Registrar paso de custodia</h1>
      <p className="hint">
        Simula la transferencia de custodia de la gema (minero → taller →
        comercializador) con una transacción real en Stellar Testnet.
      </p>

      <form className="card" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="gema">Gema</label>
          <select
            id="gema"
            required
            value={assetCode}
            onChange={(e) => setAssetCode(e.target.value)}
          >
            <option value="" disabled>
              Selecciona una gema emitida
            </option>
            {gemas.map((g) => (
              <option key={g.assetCode} value={g.assetCode}>
                {g.assetCode}
              </option>
            ))}
          </select>
        </div>

        {gemaSeleccionada && (
          <p className="hint">
            Poseedor actual: <strong>{poseedorActual.rol}</strong>
            {siguienteRol
              ? ` — siguiente paso: transferir a ${siguienteRol}.`
              : " — ya completó el recorrido del MVP."}
          </p>
        )}

        <button
          className="primary"
          type="submit"
          disabled={!siguienteRol || estado.cargando}
        >
          {estado.cargando ? "Registrando en Testnet..." : "Registrar transferencia"}
        </button>

        {estado.error && <p className="status error">{estado.error}</p>}
        {estado.ok && <p className="status success">{estado.ok}</p>}
      </form>

      {gemas.length === 0 && (
        <p className="hint">
          Todavía no hay gemas emitidas. Ve a "Emitir pasaporte" primero.
        </p>
      )}
    </div>
  );
}
