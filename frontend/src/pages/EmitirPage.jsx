import { useState } from "react";
import { emitirPasaporte, generarAssetCode } from "../lib/stellar.js";

const initialForm = {
  peso: "",
  corte: "",
  tono: "",
  claridad: "",
  hashJardin: "",
};

const OPCIONES_CORTE = [
  "Esmeralda (escalón)",
  "Oval",
  "Pera",
  "Cojín",
  "Redondo",
  "Cabujón",
];

const OPCIONES_TONO = [
  "Verde claro",
  "Verde medio",
  "Verde intenso",
  "Verde azulado",
  "Verde amarillento",
];

const OPCIONES_CLARIDAD = [
  "Loupe clean (sin inclusiones visibles a 10x)",
  "Eye clean (limpia a simple vista)",
  "Ligeramente incluida",
  "Incluida",
  "Fuertemente incluida",
];

export default function EmitirPage() {
  const [form, setForm] = useState(initialForm);
  const [estado, setEstado] = useState({ cargando: false, error: "", gema: null });

  function actualizarCampo(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setEstado({ cargando: true, error: "", gema: null });
    try {
      const assetCode = generarAssetCode();
      const gema = await emitirPasaporte({ assetCode, datosGema: form });
      setEstado({ cargando: false, error: "", gema });
      setForm(initialForm);
    } catch (err) {
      setEstado({ cargando: false, error: err.message, gema: null });
    }
  }

  return (
    <div>
      <h1>Emitir pasaporte digital</h1>
      <p className="hint">
        El laboratorio gemológico carga los datos de la esmeralda y el
        equipo emite el activo único en Stellar Testnet. Esta acción crea la
        cuenta emisora y la primera cuenta poseedora (minero) en Testnet.
      </p>

      <form className="card" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="field">
            <label htmlFor="peso">Peso (ct)</label>
            <input
              id="peso"
              required
              value={form.peso}
              onChange={(e) => actualizarCampo("peso", e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="corte">Corte</label>
            <select
              id="corte"
              required
              value={form.corte}
              onChange={(e) => actualizarCampo("corte", e.target.value)}
            >
              <option value="" disabled>
                Selecciona un corte
              </option>
              {OPCIONES_CORTE.map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="field">
            <label htmlFor="tono">Tono</label>
            <select
              id="tono"
              required
              value={form.tono}
              onChange={(e) => actualizarCampo("tono", e.target.value)}
            >
              <option value="" disabled>
                Selecciona un tono
              </option>
              {OPCIONES_TONO.map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="claridad">Claridad</label>
            <select
              id="claridad"
              required
              value={form.claridad}
              onChange={(e) => actualizarCampo("claridad", e.target.value)}
            >
              <option value="" disabled>
                Selecciona una claridad
              </option>
              {OPCIONES_CLARIDAD.map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="field">
          <label htmlFor="hashJardin">Hash del jardín óptico (de ejemplo)</label>
          <input
            id="hashJardin"
            required
            placeholder="ej. 9f3a1c..."
            value={form.hashJardin}
            onChange={(e) => actualizarCampo("hashJardin", e.target.value)}
          />
        </div>

        <button className="primary" type="submit" disabled={estado.cargando}>
          {estado.cargando ? "Emitiendo en Testnet..." : "Emitir pasaporte digital"}
        </button>

        {estado.error && <p className="status error">{estado.error}</p>}

        {estado.gema && (
          <div className="status success">
            <p>Pasaporte emitido correctamente.</p>
            <p>
              Código del activo: <strong>{estado.gema.assetCode}</strong>
            </p>
            <p className="mono">Emisor: {estado.gema.issuerPublicKey}</p>
            <p className="hint">
              Usa este código en "Registrar custodia" o "Verificar
              esmeralda" para seguir el recorrido de la gema.
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
