# Problem Brief — GENUINA

## Decisión del problema

### Problema elegido

La falta de un vínculo verificable entre cada esmeralda colombiana y su historial de origen, calidad y tratamientos permite que gemas sintéticas, de menor categoría o alteradas se vendan como naturales, mientras el minero artesanal y el orfebre local pierden valor frente a la desconfianza del comprador. Propuesto por **Manuel Quintero**.

### Por qué elegimos este

El equipo priorizó esta propuesta sobre la de cadena de frío farmacéutica (Giovanny Agudelo) por dos razones. La primera, de criterio técnico: el problema de las esmeraldas encaja directamente con al menos dos de los criterios de la Sesión 1 — varias partes que no confían entre sí (minero, laboratorio gemológico, orfebre, comprador internacional) necesitan compartir un mismo registro, y el histórico de certificación no puede alterarse una vez emitido. La segunda, de alcance: la propuesta de cadena de frío depende de hardware adicional (sensores IoT de temperatura vinculados físicamente al lote), lo que añade una capa de desarrollo que el equipo no puede sostener con solo cinco semanas de curso. La propuesta de esmeraldas, en cambio, puede desarrollarse como una solución principalmente de software sobre datos que ya existen (certificación gemológica).

### Propuestas descartadas

| Propuesta | Propuso | Motivo del descarte |
| --- | --- | --- |
| Trazabilidad de cadena de frío en transporte de medicamentos | Giovanny Agudelo | Requiere hardware dedicado (sensores de temperatura por lote) que excede el alcance viable en cinco semanas; se prefirió una propuesta resoluble principalmente con software. |

### Cómo tomamos la decisión

Por **consenso tras debate**: Giovanny y Manuel conversaron los pros y contras de ambas propuestas y acordaron avanzar con la de esmeraldas por las razones de alcance y pertinencia descritas arriba. El resto del equipo aún no participó de la decisión porque está resolviendo dificultades de acceso a GitHub y a la plataforma Apex; se incorporarán formalmente en cuanto tengan sus usuarios activos.

---

## Problem Brief

### Encabezado

**Proyecto:** GENUINA
**Problema:** Hoy no existe una forma confiable de vincular una esmeralda colombiana con la verdad sobre su origen, su calidad y los tratamientos que ha recibido, lo que abre la puerta a fraude y desconfianza en toda la cadena de valor.

### Equipo y roles

| Integrante | Usuario de GitHub | Rol | Responsable de entregas |
| --- | --- | --- | --- |
| Giovanny Agudelo | GioAgudelo | Repositorio y coordinación de entregas | Sí — carga el repositorio en la plataforma Apex |
| Manuel Quintero | Mluz1123 | Propuesta técnica y diseño de producto | No |

**Canal de coordinación interna:** WhatsApp.

El equipo está conformado por estos dos integrantes por el momento. Otros compañeros manifestaron dificultades para usar GitHub y la plataforma Apex; se unirán al equipo en cuanto resuelvan el acceso a esas herramientas.

### Problema y evidencia

Una esmeralda colombiana no es solo un mineral: cada piedra tiene un "jardín" interno de inclusiones microscópicas único e irrepetible, pero esa unicidad física no tiene hoy un equivalente verificable en el papel que la acompaña. Esmeraldas sintéticas o de menor categoría se comercializan como gemas naturales de alta calidad, y piedras intervenidas químicamente con resinas o aceites para ocultar fracturas se venden como gemas puras sin que el comprador lo sepa. El problema ocurre en cada transacción de la cadena: desde la primera venta del minero a un intermediario, hasta la compra final de una joya terminada por parte de un comprador internacional.

La evidencia de que el problema existe parte del conocimiento directo de Manuel Quintero sobre la región esmeraldera de Boyacá (Muzo, Chivor, Coscuez) y de un hecho estructural del mercado: los certificados gemológicos tradicionales, en papel o PDF, no están ligados criptográficamente a la piedra física, por lo que pueden duplicarse, alterarse o presentarse junto a una gema distinta sin que nadie lo detecte en el punto de venta.

*Pendiente del equipo: añadir un enlace o cita a una fuente externa (noticia, informe sectorial o entrevista) que respalde la frecuencia y el alcance del fraude, para reforzar esta sección antes de la entrega final.*

### Usuario y actores

Tres actores sufren directamente el problema. **Don José**, minero artesanal y guaquero en Boyacá, no cuenta con un mecanismo para certificar de forma directa el origen ético y legal de su trabajo, por lo que queda a merced de intermediarios que le pagan precios desproporcionadamente bajos por no poder demostrar la procedencia de la gema. **Camila**, diseñadora y orfebre local, engasta esmeraldas colombianas en joyas de autor pero enfrenta la desconfianza de compradores extranjeros sobre la autenticidad de las piedras, lo que le cierra mercados internacionales. **Lucas**, comprador internacional, adquiere una joya para un momento significativo de su vida y busca la certeza de que su inversión es 100% natural, de origen colombiano y libre de conflicto, certeza que hoy solo puede obtener confiando en la palabra del vendedor o en un certificado de papel.

Además de estos tres, intervienen en el flujo los **laboratorios gemológicos**, que emiten los certificados de autenticidad y calidad; los **intermediarios o comercializadores**, que compran al minero y revenden a talleres o exportadores; y las **autoridades mineras y aduaneras colombianas**, que exigen el registro de origen legal del mineral antes de su comercialización o exportación.

### Flujo actual de valor

1. **Extracción** — El minero o la asociación minera extrae la esmeralda en el socavón (Muzo, Chivor, Coscuez).
2. **Primera venta** — El minero vende la piedra a un intermediario o comercializador, generalmente sin documentación que certifique su origen ni su calidad.
3. **Registro de legalidad** *(paso normativo)* — Para poder comercializarse o exportarse, el mineral debe registrarse ante la Agencia Nacional de Minería y los comercializadores deben estar inscritos en el Registro Único de Comercializadores de Minerales (RUCOM).
4. **Certificación gemológica (opcional y costosa)** — Si se decide certificar la gema, se envía a un laboratorio especializado, a veces en el exterior, lo que implica semanas de transporte seguro, custodia y pólizas de seguro.
5. **Transformación** — Un taller artesanal talla y engasta la piedra en una joya.
6. **Venta a joyería o exportador** — La joyería o el exportador adquiere la pieza terminada, normalmente respaldada solo por el certificado en papel del paso 4, si existe.
7. **Compra final** — El comprador internacional adquiere la joya confiando en la reputación del vendedor y en un certificado que no puede verificar de forma independiente en el punto de venta.

### Fricciones identificadas

La primera fricción ocurre en el **paso 2**: al no existir forma de certificar el origen en el momento de la extracción, el intermediario fija el precio con toda la ventaja de información de su lado, y es el minero quien pierde valor. La segunda ocurre en el **paso 4**: la certificación gemológica es cara y lenta, así que muchas gemas de menor valor —precisamente las que más necesitarían generar confianza— nunca se certifican. La tercera, la más grave, ocurre entre los **pasos 4 y 7**: el certificado en papel no está ligado matemáticamente a la piedra, así que puede clonarse, alterarse o acompañar a una gema distinta sin que el comprador final en el paso 7 tenga manera de notarlo. Esta última fricción afecta a los tres actores centrales: al minero y al orfebre, porque el fraude generalizado deteriora la reputación y el valor percibido del producto colombiano completo; y al comprador, que paga un precio de gema genuina sin certeza real de estarla recibiendo.

### Oportunidad e hipótesis

La oportunidad priorizada es la fricción del **paso 4 al 7**: el vínculo roto entre la piedra física y su certificado. Se prioriza sobre las otras dos porque es la que, al resolverse, arrastra una solución parcial a las demás: si el certificado queda ligado de forma verificable a la piedra desde el momento de su extracción, el minero gana una forma de demostrar origen legal y ético desde el paso 2, no solo en el paso 4.

La hipótesis es que un registro distribuido e inalterable, alimentado por cada actor de la cadena (mina, laboratorio, taller, joyería) y vinculado a un identificador único derivado del "jardín" óptico de la gema, elimina la necesidad de que el comprador confíe ciegamente en un papel. Para el usuario, esto cambiaría la verificación de "confiar en la palabra del vendedor y en un documento no verificable" a "escanear un código y comprobar en segundos un historial que nadie pudo alterar sin que quede evidencia".

### Criterio de pertinencia

Este caso requiere un registro distribuido y no una base de datos tradicional porque se cumplen al menos dos de los criterios de la Sesión 1. Primero, **varias partes que no confían entre sí necesitan compartir un mismo registro**: el minero no confía en que el intermediario reporte el precio justo, el comprador no confía en el certificado del vendedor, y ninguno de los actores tiene motivos para aceptar que otro controle unilateralmente la base de datos de procedencia. Una base de datos tradicional resolvería el problema técnico de almacenar los datos, pero no el problema de confianza: seguiría siendo una base controlada por un solo actor (el laboratorio, el exportador o una plataforma centralizada), que es exactamente el punto débil que hoy explotan los certificados falsificados. Segundo, **el histórico no puede alterarse**: la garantía de valor de todo el sistema depende de que, una vez registrado el "jardín" óptico y los datos de una gema, ese registro no pueda editarse retroactivamente para blanquear el origen de una piedra o cambiar su historial de tratamientos. Una integración entre los sistemas existentes de los laboratorios no resuelve esto, porque cada laboratorio seguiría siendo dueño y administrador de su propia base, con capacidad técnica de alterarla.

### Supuestos y riesgos

El primer supuesto es que los **laboratorios gemológicos aceptan adoptar el proceso de escaneo del "jardín" óptico y firmar digitalmente esa huella** para anclarla a la red; si los laboratorios establecidos no cooperan, no hay forma de generar el primer registro confiable de la cadena. El segundo supuesto es que **el minero artesanal y el taller cuentan con acceso mínimo a un dispositivo móvil y conexión a internet** para registrar su paso en la cadena de custodia; si la brecha digital en las zonas mineras de Boyacá es mayor a la esperada, el eslabón más importante del flujo —el origen— quedaría fuera del sistema. El tercer supuesto es que **el costo de cada transacción en la red elegida se mantiene insignificante**; si las tarifas suben, el proyecto terminaría trasladando al minero el mismo problema de costo que hoy tienen los certificados tradicionales, y la hipótesis de valor se invalidaría.

Cualquiera de estos tres supuestos puede fallar de forma independiente, así que conviene validarlos con el equipo antes de comprometer tiempo de desarrollo en la siguiente fase del proyecto.
