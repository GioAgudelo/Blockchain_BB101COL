import { useEffect, useState } from "react";
import { cargarGemas, obtenerHistorial } from "../lib/stellar.js";

export default function VerificarPage() {
  const [gemas, setGemas] = useState([]);
  const [assetCode, setAssetCode] = useState("");
  const [estado, setEstado] = useState({ cargando: false, error: "", pagos: null });

  useEffect(() => {
    setGemas(cargarGemas());
  }, []);

  const gemaSeleccionada = gemas.find((g) => g.assetCode === assetCode);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!gemaSeleccionada) return;
    setEstado({ cargando: true, error: "", pagos: null });
    try {
      const pagos = await obtenerHistorial(gemaSeleccionada);
      setEstado({ cargando: false, error: "", pagos });
    } catch (err) {
      setEstado({ cargando: false, error: err.message, pagos: null });
    }
  }

  return (
    <div>
      <h1>Verificar esmeralda</h1>
      <p className="hint">
        Consulta pública: el historial que ves abajo se lee en vivo desde
        Horizon (Stellar Testnet), no desde una base de datos de GENUINA.
      </p>

      <form className="card" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="gema">Identificador de la gema</label>
          <select
            id="gema"
            required
            value={assetCode}
            onChange={(e) => setAssetCode(e.target.value)}
          >
            <option value="" disabled>
              Selecciona el código (simula escanear el QR)
            </option>
            {gemas.map((g) => (
              <option key={g.assetCode} value={g.assetCode}>
                {g.assetCode}
              </option>
            ))}
          </select>
        </div>

        {gemaSeleccionada && (
          <div className="hint">
            <p>Peso: {gemaSeleccionada.datosGema.peso} ct · Corte: {gemaSeleccionada.datosGema.corte}</p>
            <p>Tono: {gemaSeleccionada.datosGema.tono} · Claridad: {gemaSeleccionada.datosGema.claridad}</p>
            <p className="mono">Hash del jardín: {gemaSeleccionada.datosGema.hashJardin}</p>
          </div>
        )}

        <button className="primary" type="submit" disabled={estado.cargando}>
          {estado.cargando ? "Consultando Horizon..." : "Ver historial en Stellar Testnet"}
        </button>

        {estado.error && <p className="status error">{estado.error}</p>}
      </form>

      {estado.pagos && (
        <div className="card">
          <h2>Historial de custodia</h2>
          {estado.pagos.length === 0 ? (
            <p className="hint">Aún no hay transferencias registradas para esta gema.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>De</th>
                  <th>A</th>
                  <th>Transacción</th>
                </tr>
              </thead>
              <tbody>
                {estado.pagos.map((p) => (
                  <tr key={p.txHash}>
                    <td>{new Date(p.createdAt).toLocaleString()}</td>
                    <td className="mono">{p.from.slice(0, 10)}...</td>
                    <td className="mono">{p.to.slice(0, 10)}...</td>
                    <td>
                      <a
                        href={`https://stellar.expert/explorer/testnet/tx/${p.txHash}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        ver en explorador
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
