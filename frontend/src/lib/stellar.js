import {
  Asset,
  BASE_FEE,
  Horizon,
  Keypair,
  Networks,
  Operation,
  TransactionBuilder,
} from "@stellar/stellar-sdk";

// MVP operado por el equipo en Stellar Testnet: todas las cuentas y llaves
// de este módulo viven solo en el navegador (localStorage) y nunca deben
// usarse fuera de testnet. En el producto real, cada actor firmaría con su
// propia cuenta.
const HORIZON_URL = "https://horizon-testnet.stellar.org";
const FRIENDBOT_URL = "https://friendbot.stellar.org";
const STORAGE_KEY = "genuina_gemas";

export const server = new Horizon.Server(HORIZON_URL);

export function cargarGemas() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function guardarGemas(gemas) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(gemas));
}

export function guardarGema(gema) {
  const gemas = cargarGemas();
  gemas.push(gema);
  guardarGemas(gemas);
  return gema;
}

export function actualizarGema(assetCode, cambios) {
  const gemas = cargarGemas();
  const idx = gemas.findIndex((g) => g.assetCode === assetCode);
  if (idx === -1) throw new Error(`No existe una gema con código ${assetCode}`);
  gemas[idx] = { ...gemas[idx], ...cambios };
  guardarGemas(gemas);
  return gemas[idx];
}

export function generarAssetCode() {
  const sufijo = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `ESM${sufijo}`.slice(0, 12);
}

async function fondearCuenta(publicKey) {
  const resp = await fetch(`${FRIENDBOT_URL}?addr=${encodeURIComponent(publicKey)}`);
  if (!resp.ok) throw new Error("Friendbot no pudo fondear la cuenta en Testnet");
}

export async function crearCuentaTestnet() {
  const keypair = Keypair.random();
  await fondearCuenta(keypair.publicKey());
  return keypair;
}

async function crearTrustline(holderKeypair, asset) {
  const account = await server.loadAccount(holderKeypair.publicKey());
  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(Operation.changeTrust({ asset }))
    .setTimeout(30)
    .build();
  tx.sign(holderKeypair);
  return server.submitTransaction(tx);
}

async function pagarAsset(fromKeypair, toPublicKey, asset, amount = "1") {
  const account = await server.loadAccount(fromKeypair.publicKey());
  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      Operation.payment({ destination: toPublicKey, asset, amount })
    )
    .setTimeout(30)
    .build();
  tx.sign(fromKeypair);
  return server.submitTransaction(tx);
}

/**
 * Emite el pasaporte digital: crea la cuenta emisora (laboratorio) y la
 * primera cuenta poseedora (minero), establece la línea de confianza y
 * transfiere la unidad única del activo al minero.
 */
export async function emitirPasaporte({ assetCode, datosGema }) {
  const issuerKeypair = await crearCuentaTestnet();
  const holderKeypair = await crearCuentaTestnet();
  const asset = new Asset(assetCode, issuerKeypair.publicKey());

  await crearTrustline(holderKeypair, asset);
  await pagarAsset(issuerKeypair, holderKeypair.publicKey(), asset, "1");

  const gema = {
    assetCode,
    issuerPublicKey: issuerKeypair.publicKey(),
    issuerSecret: issuerKeypair.secret(),
    datosGema,
    custodia: [
      {
        rol: "Minero",
        publicKey: holderKeypair.publicKey(),
        secret: holderKeypair.secret(),
      },
    ],
  };
  guardarGema(gema);
  return gema;
}

/**
 * Simula el siguiente paso de custodia (Minero -> Taller -> Comercializador):
 * crea la cuenta del nuevo poseedor, establece la línea de confianza y
 * transfiere la unidad del activo desde el poseedor actual.
 */
export async function registrarCustodia({ assetCode, siguienteRol }) {
  const gemas = cargarGemas();
  const gema = gemas.find((g) => g.assetCode === assetCode);
  if (!gema) throw new Error(`No existe una gema con código ${assetCode}`);

  const asset = new Asset(assetCode, gema.issuerPublicKey);
  const poseedorActual = gema.custodia[gema.custodia.length - 1];
  const actualKeypair = Keypair.fromSecret(poseedorActual.secret);

  const nuevoKeypair = await crearCuentaTestnet();
  await crearTrustline(nuevoKeypair, asset);
  await pagarAsset(actualKeypair, nuevoKeypair.publicKey(), asset, "1");

  const nuevaCustodia = [
    ...gema.custodia,
    {
      rol: siguienteRol,
      publicKey: nuevoKeypair.publicKey(),
      secret: nuevoKeypair.secret(),
    },
  ];
  return actualizarGema(assetCode, { custodia: nuevaCustodia });
}

/**
 * Lee directamente de Horizon Testnet el historial de pagos del activo,
 * es decir, el recorrido real de la gema por los distintos poseedores.
 *
 * Horizon no expone un endpoint de "pagos por activo": cada pago solo
 * aparece en la cuenta de origen y destino. Por eso recorremos las cuentas
 * involucradas (emisor + cada poseedor registrado) y consultamos sus pagos;
 * el contenido de cada pago (monto, fecha, hash de transacción) viene
 * siempre de Horizon, nunca de localStorage. localStorage solo guarda qué
 * cuentas preguntar, igual que un código QR solo apunta al identificador.
 */
export async function obtenerHistorial(gema) {
  const asset = new Asset(gema.assetCode, gema.issuerPublicKey);
  const cuentas = [
    gema.issuerPublicKey,
    ...gema.custodia.map((c) => c.publicKey),
  ];

  const resultados = await Promise.all(
    cuentas.map((pubKey) =>
      server.payments().forAccount(pubKey).order("asc").limit(50).call()
    )
  );

  const vistos = new Set();
  const pagos = [];
  for (const page of resultados) {
    for (const op of page.records) {
      if (
        op.type !== "payment" ||
        op.asset_code !== asset.getCode() ||
        op.asset_issuer !== asset.getIssuer()
      ) {
        continue;
      }
      if (vistos.has(op.id)) continue;
      vistos.add(op.id);
      pagos.push({
        from: op.from,
        to: op.to,
        amount: op.amount,
        createdAt: op.created_at,
        txHash: op.transaction_hash,
      });
    }
  }

  return pagos.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}
