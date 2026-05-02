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
        margin: 12mm;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        color: #171717;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 10px;
        line-height: 1.35;
        background: #ffffff;
      }

      h1,
      h2,
      p {
        margin: 0;
      }

      .sheet {
        display: grid;
        gap: 8px;
      }

      .header {
        display: grid;
        grid-template-columns: 1.4fr 1fr 0.8fr;
        gap: 8px;
        align-items: start;
        border-bottom: 2px solid #171717;
        padding-bottom: 8px;
      }

      h1 {
        font-size: 22px;
        line-height: 1.05;
      }

      h2 {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0;
        border-bottom: 1px solid #171717;
        padding-bottom: 2px;
        margin-bottom: 5px;
      }

      .section {
        break-inside: avoid;
        border: 1px solid #171717;
        padding: 7px;
      }

      .grid {
        display: grid;
        gap: 6px;
      }

      .grid.two {
        grid-template-columns: 1fr 1fr;
      }

      .grid.three {
        grid-template-columns: repeat(3, 1fr);
      }

      .field-label {
        color: #525252;
        font-size: 8px;
        text-transform: uppercase;
      }

      .field-value {
        min-height: 14px;
        border-bottom: 1px solid #d4d4d4;
        font-size: 10px;
        overflow-wrap: anywhere;
      }

      .main-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }

      .stats {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 6px;
      }

      .stat {
        border: 1px solid #a3a3a3;
        padding: 5px;
        text-align: center;
      }

      .stat-name {
        color: #525252;
        font-size: 8px;
        text-transform: uppercase;
      }

      .stat-value {
        font-size: 15px;
        font-weight: 700;
      }

      .list {
        display: grid;
        gap: 3px;
      }

      .list-row {
        display: grid;
        grid-template-columns: 1fr auto auto;
        gap: 5px;
        border-bottom: 1px solid #e5e5e5;
        padding-bottom: 2px;
      }

      .muted {
        color: #737373;
      }
    </style>
  </head>
  <body>
    <main class="sheet">
      <section class="header">
        <div>
          <div class="field-label">Nome</div>
          <h1>${value(sheet.nome)}</h1>
        </div>
        ${field('Jogador', sheet.jogador)}
        ${field('Data de criação', sheet.dataCriacao)}
      </section>

      <section class="section">
        <h2>Identidade</h2>
        <div class="grid three">
          ${field('Aparência', sheet.aparencia)}
          ${field('Cenário', sheet.cenario)}
          ${field('CM', sheet.cm)}
          ${field('PP', sheet.pp)}
          ${field('PP para gastar', sheet.ppParaGastar)}
          ${field('Altura', sheet.altura)}
          ${field('Tamanho', formatSize(sheet.tamanho))}
        </div>
      </section>

      <div class="main-grid">
        <section class="section">
          <h2>Atributos</h2>
          <div class="stats">
            ${attributeStat('FO', sheet.atributos.fo)}
            ${attributeStat('DE', sheet.atributos.de)}
            ${attributeStat('IT', sheet.atributos.it)}
            ${attributeStat('CO', sheet.atributos.co)}
          </div>
        </section>

        <section class="section">
          <h2>Capacidades físicas</h2>
          <div class="grid three">
            ${resourceField('PV', sheet.capacidadesFisicas.pv)}
            ${resourceField('PF', sheet.capacidadesFisicas.pf)}
            ${resourceField('EX', sheet.capacidadesFisicas.ex)}
            ${field('Vel. base', sheet.capacidadesFisicas.velocidadeBase)}
            ${field('Vel. corrida', sheet.capacidadesFisicas.velocidadeCorrida)}
            ${field('Reflexo', sheet.capacidadesFisicas.reflexo)}
            ${field('Base carga', sheet.capacidadesFisicas.baseCarga)}
            ${field('Fator carga', sheet.capacidadesFisicas.fatorCarga)}
          </div>
        </section>
      </div>

      <section class="section">
        <h2>Competências</h2>
        <div class="grid three">
          ${field('Linguística', sheet.competencias.linguistica)}
          ${field('Lógica', sheet.competencias.logica)}
          ${field('Espacial', sheet.competencias.espacial)}
          ${field('Cinestésica', sheet.competencias.cinestesica)}
          ${field('Interpessoal', sheet.competencias.interpessoal)}
          ${field('Intrapessoal', sheet.competencias.intrapessoal)}
          ${field('Naturalista', sheet.competencias.naturalista)}
          ${field('Musical', sheet.competencias.musical)}
          ${field('Exótica', sheet.competencias.exotica)}
        </div>
      </section>

      <section class="section">
        <h2>História</h2>
        <p>${multiline(sheet.historia)}</p>
      </section>

      <div class="main-grid">
        <section class="section">
          <h2>Inventário</h2>
          <div class="list">${inventory(sheet.inventario)}</div>
        </section>

        <section class="section">
          <h2>Marcas pessoais</h2>
          <div class="list">${simpleList(sheet.marcasPessoais)}</div>
        </section>
      </div>

      <section class="section">
        <h2>Anotações</h2>
        <p>${multiline(sheet.anotacoes)}</p>
      </section>
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

function field(label: string, rawValue: unknown): string {
  return `<div>
    <div class="field-label">${escapeHtml(label)}</div>
    <div class="field-value">${value(rawValue)}</div>
  </div>`;
}

function resourceField(label: string, resource: Resource): string {
  return field(
    label,
    `max ${toText(resource.maximo)} / metade ${toText(resource.metade)} / atual ${toText(resource.atual)}`,
  );
}

function attributeStat(
  label: string,
  attribute: Attribute | AttributeWithMagnitude,
): string {
  const magnitude =
    'comCm' in attribute && attribute.comCm !== null
      ? `<div class="muted">CM ${escapeHtml(String(attribute.comCm))}</div>`
      : '';

  return `<div class="stat">
    <div class="stat-name">${escapeHtml(label)}</div>
    <div class="stat-value">${value(attribute.atual)}</div>
    <div class="muted">base ${value(attribute.base)}</div>
    ${magnitude}
  </div>`;
}

function inventory(items: CharacterSheet['inventario']): string {
  if (!items.length) {
    return `<div class="muted">${empty}</div>`;
  }

  return items
    .map(
      (item) => `<div class="list-row">
        <span>${value(item.nome)}</span>
        <span class="muted">${item.tipo === 'item-magico' ? 'mágico' : 'comum'}</span>
        <span class="muted">${value(item.peso)} kg</span>
      </div>`,
    )
    .join('');
}

function simpleList(items: string[]): string {
  if (!items.length) {
    return `<div class="muted">${empty}</div>`;
  }

  return items.map((item) => `<div>${value(item)}</div>`).join('');
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
    return rawValue.trim();
  }

  if (typeof rawValue === 'number' || typeof rawValue === 'boolean') {
    return String(rawValue).trim();
  }

  return empty;
}

function escapeHtml(valueToEscape: string): string {
  return valueToEscape
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
