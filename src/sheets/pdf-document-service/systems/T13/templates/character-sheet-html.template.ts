import type { CharacterSheet } from '../../../../schemas/character-sheet.schema';

type Resource = CharacterSheet['capacidadesFisicas']['pv'];
type Attribute = CharacterSheet['atributos']['de'];
type AttributeWithMagnitude = CharacterSheet['atributos']['fo'];

const empty = '-';

export function createT13CharacterSheetHtmlTemplate(
  data: CharacterSheet,
): string {
  const sheet = withCharacterSheetDefaults(data);

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>Ficha T13 - ${escapeHtml(sheet.nome ?? 'Personagem')}</title>
    <style>
      @page {
        size: A4;
        margin: 0;
      }

      * {
        box-sizing: border-box;
      }

      html,
      body {
        margin: 0;
        min-height: 100%;
        color: #11161a;
        background: #f1eee8;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 8.5px;
        line-height: 1.25;
      }

      body {
        padding: 0;
      }

      h1,
      h2,
      h3,
      p {
        margin: 0;
      }

      .page {
        position: relative;
        width: 210mm;
        min-height: 297mm;
        margin: 0 auto;
        padding: 10mm 9mm 8mm;
        overflow: hidden;
        background:
          radial-gradient(circle at 82% 70%, rgba(17, 22, 26, 0.045), transparent 0.1mm, transparent 34mm),
          linear-gradient(135deg, rgba(17, 22, 26, 0.04) 0 1px, transparent 1px 7px),
          #f5f2ec;
        border: 5px solid #11161a;
      }

      .page::before,
      .page::after {
        content: '';
        position: absolute;
        inset: 7mm;
        pointer-events: none;
        border: 1px solid rgba(17, 22, 26, 0.35);
      }

      .page::after {
        inset: 3mm;
        border-color: rgba(17, 22, 26, 0.16);
      }

      .top-bar {
        position: absolute;
        top: 0;
        right: 0;
        width: 59mm;
        height: 10mm;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 6mm;
        padding-right: 5mm;
        color: #f5f2ec;
        background: #11161a;
        clip-path: polygon(8mm 0, 100% 0, 100% 100%, 15mm 100%);
        font-size: 8px;
        letter-spacing: 0;
        text-transform: uppercase;
      }

      .barcode {
        display: inline-block;
        width: 23mm;
        height: 4mm;
        background: repeating-linear-gradient(
          90deg,
          currentColor 0 0.45mm,
          transparent 0.45mm 0.85mm,
          currentColor 0.85mm 1.05mm,
          transparent 1.05mm 1.45mm
        );
      }

      .header {
        position: relative;
        z-index: 1;
        display: grid;
        grid-template-columns: 23mm 1fr 1px 91mm;
        gap: 8mm;
        align-items: center;
        margin-bottom: 7mm;
      }

      .mark {
        width: 22mm;
        height: 22mm;
        display: grid;
        place-items: center;
        color: #b23a3d;
        border: 2.5mm solid #11161a;
        border-radius: 999px;
        outline: 1px solid #11161a;
        outline-offset: 2mm;
        font-size: 17px;
        font-weight: 900;
      }

      .brand-title {
        color: #11161a;
        font-size: 33px;
        font-weight: 900;
        line-height: 0.9;
        text-transform: uppercase;
        letter-spacing: 0;
      }

      .brand-title span {
        color: #a93639;
      }

      .subtitle {
        margin-top: 3mm;
        font-size: 7px;
        letter-spacing: 2.4px;
        text-transform: uppercase;
      }

      .header-divider {
        height: 23mm;
        background: rgba(17, 22, 26, 0.35);
      }

      .dossier-fields {
        display: grid;
        gap: 4mm;
        padding-top: 6mm;
      }

      .line-field {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 3mm;
        align-items: end;
        min-width: 0;
      }

      .line-label {
        font-weight: 800;
        text-transform: uppercase;
        white-space: nowrap;
      }

      .line-value {
        min-height: 4mm;
        border-bottom: 1px solid rgba(17, 22, 26, 0.55);
        overflow-wrap: anywhere;
      }

      .panel {
        position: relative;
        z-index: 1;
        padding: 7mm 5mm 4mm;
        border: 1.3px solid #11161a;
        background: rgba(245, 242, 236, 0.88);
        break-inside: avoid;
      }

      .panel::before,
      .panel::after {
        content: '';
        position: absolute;
        width: 5mm;
        height: 5mm;
        border-color: #11161a;
        pointer-events: none;
      }

      .panel::before {
        top: 1.2mm;
        left: 1.2mm;
        border-top: 1.3px solid;
        border-left: 1.3px solid;
      }

      .panel::after {
        right: 1.2mm;
        bottom: 1.2mm;
        border-right: 1.3px solid;
        border-bottom: 1.3px solid;
      }

      .panel-tab {
        position: absolute;
        top: -1.3px;
        left: -1.3px;
        min-width: 34mm;
        height: 7.4mm;
        display: flex;
        align-items: center;
        gap: 2mm;
        padding: 0 8mm 0 4mm;
        color: #f5f2ec;
        background: #11161a;
        clip-path: polygon(0 0, 100% 0, calc(100% - 5mm) 100%, 0 100%);
        font-size: 8.5px;
        text-transform: uppercase;
      }

      .panel-note {
        position: absolute;
        top: 2.4mm;
        right: 4mm;
        font-size: 6.5px;
        text-transform: uppercase;
      }

      .icon {
        width: 4mm;
        height: 4mm;
        display: inline-grid;
        place-items: center;
        flex: 0 0 auto;
        color: #11161a;
        font-size: 8px;
        font-weight: 900;
        line-height: 1;
      }

      .panel-tab .icon {
        color: #f5f2ec;
      }

      .identity {
        display: grid;
        grid-template-columns: 1fr 63mm;
        gap: 6mm;
      }

      .identity-left {
        display: grid;
        gap: 4mm;
      }

      .identity-row {
        display: grid;
        grid-template-columns: 5mm 28mm 1fr;
        gap: 3mm;
        align-items: center;
      }

      .identity-metrics {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 5mm;
      }

      .metric {
        display: grid;
        grid-template-columns: 5mm auto 1fr;
        gap: 2.5mm;
        align-items: center;
      }

      .date-box,
      .small-box,
      .score-box,
      .cell {
        border: 1px solid rgba(17, 22, 26, 0.78);
        background: rgba(255, 255, 255, 0.18);
      }

      .date-box {
        min-height: 7mm;
        display: flex;
        align-items: center;
        justify-content: center;
        letter-spacing: 0;
      }

      .small-box {
        min-height: 6.5mm;
        padding: 1mm;
        text-align: center;
      }

      .identity-right {
        display: grid;
        grid-template-columns: 1fr 18mm;
        align-content: start;
        gap: 4mm;
        padding-left: 5mm;
        border-left: 1px solid rgba(17, 22, 26, 0.25);
      }

      .score-box {
        min-height: 7mm;
        padding: 1mm;
        text-align: center;
      }

      .history {
        min-height: 27mm;
      }

      .lined-area {
        min-height: 100%;
        padding: 2mm 1mm 0;
        background-image: repeating-linear-gradient(
          to bottom,
          transparent 0 5.4mm,
          rgba(17, 22, 26, 0.25) 5.4mm 5.6mm
        );
        overflow-wrap: anywhere;
        white-space: normal;
      }

      .content-grid {
        position: relative;
        z-index: 1;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4mm;
        margin-top: 4mm;
      }

      .stack {
        display: grid;
        gap: 4mm;
      }

      .attribute-table {
        display: grid;
        grid-template-columns: 1fr 11mm 11mm 11mm;
        gap: 3mm;
        align-items: center;
      }

      .table-head {
        font-size: 6.5px;
        text-align: center;
        text-transform: uppercase;
      }

      .attribute-name,
      .competence-name {
        display: flex;
        align-items: center;
        gap: 2mm;
        font-weight: 800;
        text-transform: uppercase;
      }

      .cell {
        height: 7mm;
        display: grid;
        place-items: center;
        font-size: 10px;
        font-weight: 800;
      }

      .competence-table {
        display: grid;
        grid-template-columns: 1fr 7mm 7mm 7mm;
        gap: 1.8mm 4mm;
        align-items: center;
      }

      .competence-name {
        position: relative;
        overflow: hidden;
      }

      .competence-name span:last-child {
        position: relative;
        z-index: 1;
        padding-right: 1.5mm;
        background: #f5f2ec;
      }

      .competence-name::after {
        content: '';
        position: absolute;
        right: 0;
        bottom: 1mm;
        width: calc(100% - 23mm);
        border-bottom: 1px dotted rgba(17, 22, 26, 0.35);
      }

      .check {
        width: 4.8mm;
        height: 4.8mm;
        display: grid;
        place-items: center;
        border: 1px solid rgba(17, 22, 26, 0.62);
        font-size: 7px;
        font-weight: 900;
      }

      .capacity-list {
        display: grid;
        gap: 4mm;
      }

      .capacity-row {
        display: grid;
        grid-template-columns: 5mm 16mm 1fr;
        gap: 3mm;
        align-items: center;
      }

      .track {
        display: grid;
        grid-template-columns: repeat(20, 1fr);
        min-height: 4mm;
        border-left: 1px solid rgba(17, 22, 26, 0.35);
      }

      .track span {
        border-top: 1px solid rgba(17, 22, 26, 0.35);
        border-right: 1px solid rgba(17, 22, 26, 0.35);
        border-bottom: 1px solid rgba(17, 22, 26, 0.35);
        background: rgba(255, 255, 255, 0.16);
      }

      .track span.filled {
        background: rgba(17, 22, 26, 0.18);
      }

      .capacity-meta {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2mm;
        margin-top: 4mm;
      }

      .mini-panel {
        min-height: 24mm;
        padding: 3mm;
        border: 1px solid rgba(17, 22, 26, 0.68);
      }

      .mini-line {
        display: grid;
        grid-template-columns: 18mm 1fr;
        gap: 2mm;
        margin-bottom: 2.2mm;
        text-transform: uppercase;
      }

      .scenario-box {
        position: relative;
        min-height: 38mm;
      }

      .scenario-watermark {
        position: absolute;
        right: 11mm;
        bottom: 5mm;
        width: 31mm;
        height: 31mm;
        border: 1px solid rgba(17, 22, 26, 0.07);
        border-radius: 999px;
      }

      .scenario-watermark::before,
      .scenario-watermark::after {
        content: '';
        position: absolute;
        inset: 50% auto auto 50%;
        width: 36mm;
        border-top: 1px solid rgba(17, 22, 26, 0.06);
        transform: translate(-50%, -50%);
      }

      .scenario-watermark::after {
        width: 1px;
        height: 36mm;
        border-top: 0;
        border-left: 1px solid rgba(17, 22, 26, 0.06);
      }

      .inventory {
        min-height: 28mm;
      }

      .bottom-grid {
        position: relative;
        z-index: 1;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4mm;
        margin-top: 4mm;
      }

      .bullet-list {
        display: grid;
        gap: 2.2mm;
      }

      .bullet-row {
        display: grid;
        grid-template-columns: 4mm 1fr;
        gap: 2mm;
        align-items: end;
      }

      .bullet {
        text-align: center;
        font-size: 8px;
      }

      .footer {
        position: relative;
        z-index: 1;
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        gap: 8mm;
        margin-top: 4mm;
        color: rgba(17, 22, 26, 0.66);
        font-size: 7px;
        letter-spacing: 0.8px;
        text-transform: uppercase;
      }

      .footer strong {
        color: #a93639;
        font-weight: 400;
      }

      .footer .barcode {
        justify-self: end;
        width: 43mm;
        height: 5mm;
        color: #11161a;
      }

      .muted {
        color: rgba(17, 22, 26, 0.55);
      }
    </style>
  </head>
  <body>
    <main class="page">
      <div class="top-bar">
        <span>[ confidencial ]</span>
        <span class="barcode"></span>
      </div>

      <header class="header">
        <div class="mark">13</div>
        <div>
          <h1 class="brand-title">Target <span>13</span></h1>
          <p class="subtitle">Sistema universal de narrativa</p>
        </div>
        <div class="header-divider"></div>
        <div class="dossier-fields">
          ${lineField('Codinome', sheet.nome)}
          ${lineField('Afiliação', sheet.cenario)}
          ${lineField('Data', sheet.dataCriacao)}
        </div>
      </header>

      <section class="panel">
        <div class="identity">
          <div class="identity-left">
            ${identityLine('person', 'Nome do jogador', sheet.jogador)}
            ${identityLine('mask', 'Nome do personagem', sheet.nome)}
            <div class="identity-row">
              ${icon('calendar')}
              <span class="line-label">Data de criação:</span>
              <span class="date-box">${value(sheet.dataCriacao)}</span>
            </div>
            <div class="identity-metrics">
              ${metric('size', 'Tamanho', formatSize(sheet.tamanho))}
              ${metric('ruler', 'Altura', sheet.altura)}
              ${metric('weight', 'Peso', empty)}
            </div>
            <div class="identity-row">
              ${icon('target')}
              <span class="line-label">Classe de magnitude:</span>
              <span class="small-box">${value(sheet.cm)}</span>
            </div>
          </div>

          <div class="identity-right">
            <span class="line-label">Pontos de personagem:</span>
            <span class="score-box">${value(sheet.pp)}</span>
            <span class="line-label">Pontos de experiência:</span>
            <span class="score-box">${value(sheet.ppParaGastar)}</span>
            <span class="line-label">Aparência:</span>
            <span class="line-value">${value(sheet.aparencia)}</span>
          </div>
        </div>
      </section>

      <section class="panel history" style="margin-top: 4mm;">
        ${panelTab('file', 'História')}
        <div class="lined-area">${multiline(sheet.historia)}</div>
      </section>

      <div class="content-grid">
        <div class="stack">
          <section class="panel">
            ${panelTab('menu', 'Atributos')}
            <div class="attribute-table">
              <div></div>
              <div class="table-head">Base</div>
              <div class="table-head">Atual</div>
              <div class="table-head">+CM</div>
              ${attributeRow('strength', 'Força', sheet.atributos.fo)}
              ${attributeRow('agility', 'Destreza', sheet.atributos.de)}
              ${attributeRow('mind', 'Intelecto', sheet.atributos.it)}
              ${attributeRow('shield', 'Constituição', sheet.atributos.co)}
            </div>
          </section>

          <section class="panel">
            ${panelTab('clipboard', 'Competências')}
            <div class="competence-table">
              <div></div>
              <div class="table-head">+1</div>
              <div class="table-head">+2</div>
              <div class="table-head">+3</div>
              ${competenceRow('chat', 'Linguística', sheet.competencias.linguistica)}
              ${competenceRow('calc', 'Lógica/Matemática', sheet.competencias.logica)}
              ${competenceRow('cube', 'Espacial', sheet.competencias.espacial)}
              ${competenceRow('run', 'C. Cinestésica', sheet.competencias.cinestesica)}
              ${competenceRow('group', 'Interpessoal', sheet.competencias.interpessoal)}
              ${competenceRow('self', 'Intrapessoal', sheet.competencias.intrapessoal)}
              ${competenceRow('leaf', 'Naturalista', sheet.competencias.naturalista)}
              ${competenceRow('music', 'Musical', sheet.competencias.musical)}
              ${competenceRow('star', 'Exótica', sheet.competencias.exotica)}
            </div>
          </section>
        </div>

        <div class="stack">
          <section class="panel">
            ${panelTab('heart', 'Capacidades físicas')}
            <div class="capacity-list">
              ${capacityRow('heart', 'PV', sheet.capacidadesFisicas.pv)}
              ${capacityRow('bolt', 'PF', sheet.capacidadesFisicas.pf)}
              ${capacityRow('target', 'ATB CE', sheet.capacidadesFisicas.ex)}
            </div>
            <div class="capacity-meta">
              <div class="mini-panel">
                ${miniLine('Vel. base', sheet.capacidadesFisicas.velocidadeBase)}
                ${miniLine('Corrida', sheet.capacidadesFisicas.velocidadeCorrida)}
                ${miniLine('Reflexo', sheet.capacidadesFisicas.reflexo)}
                ${miniLine('B C', sheet.capacidadesFisicas.baseCarga)}
                ${miniLine('F C', sheet.capacidadesFisicas.fatorCarga)}
              </div>
              <div class="mini-panel">
                ${miniLine('Vel. base', empty)}
                ${miniLine('ATV', empty)}
                ${miniLine('Pass', empty)}
              </div>
            </div>
          </section>

          <section class="panel scenario-box">
            ${panelTab('module', 'Módulo de cenário')}
            <span class="panel-note">[ configurado pelo mestre ]</span>
            <div class="lined-area">${value(sheet.cenario)}</div>
            <span class="scenario-watermark"></span>
          </section>
        </div>
      </div>

      <section class="panel inventory" style="margin-top: 4mm;">
        ${panelTab('bag', 'Inventário')}
        <div class="lined-area">${inventory(sheet.inventario)}</div>
      </section>

      <div class="bottom-grid">
        <section class="panel">
          ${panelTab('fingerprint', 'Marcas pessoais')}
          <div class="bullet-list">${bulletList(sheet.marcasPessoais, 4)}</div>
        </section>

        <section class="panel">
          ${panelTab('memory', 'Memórias canônicas')}
          <div class="bullet-list">${bulletList(sheet.memoriasCanonicas, 4)}</div>
        </section>
      </div>

      <footer class="footer">
        <span>T13-Dossier</span>
        <strong>Acesso restrito</strong>
        <span class="barcode"></span>
      </footer>
    </main>
  </body>
</html>`;
}

function withCharacterSheetDefaults(data: CharacterSheet): CharacterSheet {
  return {
    ...data,
    tamanho: data.tamanho ?? { x: null, y: null },
    capacidadesFisicas: {
      pv: data.capacidadesFisicas?.pv ?? emptyResource(),
      pf: data.capacidadesFisicas?.pf ?? emptyResource(),
      ex: data.capacidadesFisicas?.ex ?? emptyResource(),
      velocidadeBase: data.capacidadesFisicas?.velocidadeBase ?? null,
      velocidadeCorrida: data.capacidadesFisicas?.velocidadeCorrida ?? null,
      reflexo: data.capacidadesFisicas?.reflexo ?? null,
      baseCarga: data.capacidadesFisicas?.baseCarga ?? null,
      fatorCarga: data.capacidadesFisicas?.fatorCarga ?? null,
      defesas: data.capacidadesFisicas?.defesas ?? [],
    },
    atributos: {
      fo: data.atributos?.fo ?? { base: null, atual: null, comCm: null },
      de: data.atributos?.de ?? { base: null, atual: null },
      it: data.atributos?.it ?? { base: null, atual: null },
      co: data.atributos?.co ?? { base: null, atual: null, comCm: null },
    },
    competencias: {
      linguistica: data.competencias?.linguistica ?? null,
      logica: data.competencias?.logica ?? null,
      espacial: data.competencias?.espacial ?? null,
      cinestesica: data.competencias?.cinestesica ?? null,
      interpessoal: data.competencias?.interpessoal ?? null,
      intrapessoal: data.competencias?.intrapessoal ?? null,
      naturalista: data.competencias?.naturalista ?? null,
      musical: data.competencias?.musical ?? null,
      exotica: data.competencias?.exotica ?? null,
    },
    memoriasCanonicas: data.memoriasCanonicas ?? [],
    marcasPessoais: data.marcasPessoais ?? [],
    inventario: data.inventario ?? [],
  };
}

function emptyResource(): Resource {
  return { maximo: null, metade: null, atual: null };
}

function panelTab(iconName: string, label: string): string {
  return `<div class="panel-tab">${icon(iconName)}<span>${escapeHtml(label)}</span></div>`;
}

function lineField(label: string, rawValue: unknown): string {
  return `<div class="line-field">
    <span class="line-label">${escapeHtml(label)}:</span>
    <span class="line-value">${value(rawValue)}</span>
  </div>`;
}

function identityLine(
  iconName: string,
  label: string,
  rawValue: unknown,
): string {
  return `<div class="identity-row">
    ${icon(iconName)}
    <span class="line-label">${escapeHtml(label)}:</span>
    <span class="line-value">${value(rawValue)}</span>
  </div>`;
}

function metric(iconName: string, label: string, rawValue: unknown): string {
  return `<div class="metric">
    ${icon(iconName)}
    <span class="line-label">${escapeHtml(label)}:</span>
    <span class="small-box">${value(rawValue)}</span>
  </div>`;
}

function attributeRow(
  iconName: string,
  label: string,
  attribute: Attribute | AttributeWithMagnitude,
): string {
  const magnitude =
    'comCm' in attribute
      ? value(attribute.comCm)
      : `<span class="muted">-</span>`;

  return `<div class="attribute-name">${icon(iconName)}<span>${escapeHtml(label)}</span></div>
    <div class="cell">${value(attribute.base)}</div>
    <div class="cell">${value(attribute.atual)}</div>
    <div class="cell">${magnitude}</div>`;
}

function competenceRow(
  iconName: string,
  label: string,
  rawValue: unknown,
): string {
  const valueAsNumber = typeof rawValue === 'number' ? rawValue : 0;

  return `<div class="competence-name">${icon(iconName)}<span>${escapeHtml(label)}</span></div>
    ${checkCell(valueAsNumber >= 1)}
    ${checkCell(valueAsNumber >= 2)}
    ${checkCell(valueAsNumber >= 3)}`;
}

function checkCell(checked: boolean): string {
  return `<div class="check">${checked ? 'x' : ''}</div>`;
}

function capacityRow(
  iconName: string,
  label: string,
  resource: Resource,
): string {
  return `<div class="capacity-row">
    ${icon(iconName)}
    <span class="line-label">${escapeHtml(label)}</span>
    ${track(resource.atual, resource.maximo)}
  </div>`;
}

function track(currentValue: unknown, maxValue: unknown): string {
  const max = numberOrZero(maxValue);
  const current = numberOrZero(currentValue);
  const filled = max > 0 ? Math.round((Math.min(current, max) / max) * 20) : 0;

  return `<div class="track">${Array.from(
    { length: 20 },
    (_, index) => `<span class="${index < filled ? 'filled' : ''}"></span>`,
  ).join('')}</div>`;
}

function miniLine(label: string, rawValue: unknown): string {
  return `<div class="mini-line">
    <span>${escapeHtml(label)}:</span>
    <span class="line-value">${value(rawValue)}</span>
  </div>`;
}

function inventory(items: CharacterSheet['inventario']): string {
  if (!items.length) {
    return emptyLines(5);
  }

  return items
    .map((item) => {
      const type = item.tipo === 'item-magico' ? 'mágico' : 'comum';

      return `• ${value(item.nome)} <span class="muted">(${type}, ${value(item.peso)} kg)</span>`;
    })
    .join('<br />');
}

function bulletList(items: string[], minRows: number): string {
  const rows = [...items];

  while (rows.length < minRows) {
    rows.push('');
  }

  return rows
    .slice(0, Math.max(rows.length, minRows))
    .map(
      (item) => `<div class="bullet-row">
        <span class="bullet">◆</span>
        <span class="line-value">${item ? value(item) : '&nbsp;'}</span>
      </div>`,
    )
    .join('');
}

function emptyLines(count: number): string {
  return Array.from({ length: count }, () => '&nbsp;').join('<br />');
}

function formatSize(size: CharacterSheet['tamanho']): string {
  return `${toText(size.x)} x ${toText(size.y)}`;
}

function multiline(rawValue: unknown): string {
  return value(rawValue).replace(/\n/g, '<br />');
}

function value(rawValue: unknown): string {
  return escapeHtml(toText(rawValue));
}

function toText(rawValue: unknown): string {
  if (rawValue === null || rawValue === undefined || rawValue === '') {
    return empty;
  }

  if (typeof rawValue === 'string') {
    const valueToFormat = rawValue.trim();

    return valueToFormat === '' ? empty : valueToFormat;
  }

  if (typeof rawValue === 'number' || typeof rawValue === 'boolean') {
    return String(rawValue).trim();
  }

  return empty;
}

function numberOrZero(rawValue: unknown): number {
  if (typeof rawValue !== 'number' || !Number.isFinite(rawValue)) {
    return 0;
  }

  return rawValue;
}

function icon(name: string): string {
  const icons: Record<string, string> = {
    agility: '↟',
    bag: '▣',
    bolt: 'ϟ',
    calc: '#',
    calendar: '▦',
    chat: '●',
    clipboard: '▤',
    cube: '◆',
    file: '▥',
    fingerprint: '◎',
    group: '♟',
    heart: '♥',
    leaf: '◒',
    mask: '◕',
    memory: '◈',
    menu: '☰',
    mind: '◌',
    module: '▰',
    music: '♪',
    person: '●',
    ruler: '╱',
    run: '↗',
    self: '◉',
    shield: '⬟',
    size: '▌',
    star: '★',
    strength: '✹',
    target: '⊕',
    weight: '♜',
  };

  return `<span class="icon">${icons[name] ?? '■'}</span>`;
}

function escapeHtml(valueToEscape: string): string {
  return valueToEscape
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
