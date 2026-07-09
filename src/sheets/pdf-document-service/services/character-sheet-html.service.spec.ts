import { createNewT13CharacterSheet } from '../systems/T13/templates/new-sheet.template';
import { CharacterSheetHtmlService } from './character-sheet-html.service';

describe('CharacterSheetHtmlService', () => {
  it('should create the T13 character sheet html', () => {
    const service = new CharacterSheetHtmlService();
    const sheet = {
      ...createNewT13CharacterSheet(),
      nome: 'Arkon <Valedouro>',
      jogador: 'Milton',
      inventario: [
        {
          nome: 'Espada & escudo',
          valor: null,
          peso: 2,
          tipo: 'item-comum' as const,
          fichaItemMagicoId: null,
        },
      ],
      marcasPessoais: ['Cicatriz'],
      historia: 'Linha 1\nLinha 2',
    };

    const html = service.createCharacterSheetHtml(sheet);

    expect(html).toContain('<!doctype html>');
    expect(html).toContain('Target <span>13</span>');
    expect(html).toContain('Arkon &lt;Valedouro&gt;');
    expect(html).toContain('Espada &amp; escudo');
    expect(html).toContain('Linha 1<br />Linha 2');
  });

  it('should render defaults, empty lists and magic inventory labels', () => {
    const service = new CharacterSheetHtmlService();
    const html = service.createCharacterSheetHtml({
      ...createNewT13CharacterSheet(),
      capacidadesFisicas: undefined,
      atributos: undefined,
      competencias: undefined,
      tamanho: undefined,
      inventario: [
        {
          nome: 'Relíquia',
          valor: null,
          peso: null,
          tipo: 'item-magico',
          fichaItemMagicoId: null,
        },
      ],
      marcasPessoais: [],
    } as never);

    expect(html).toContain('mágico');
    expect(html).toContain('- kg');
    expect(html).toContain('- x -');
    expect(html).toContain('Marcas pessoais');
  });

  it('should render empty inventory and unsupported scalar values as dashes', () => {
    const service = new CharacterSheetHtmlService();
    const html = service.createCharacterSheetHtml({
      ...createNewT13CharacterSheet(),
      cm: { value: 1 },
      inventario: [],
      marcasPessoais: [],
    } as never);

    expect(html).toContain('<section class="panel inventory"');
    expect(html).toContain('<span class="small-box">-</span>');
  });

  it('should render partial nested groups with defaults', () => {
    const service = new CharacterSheetHtmlService();
    const html = service.createCharacterSheetHtml({
      ...createNewT13CharacterSheet(),
      capacidadesFisicas: {
        pv: undefined,
        pf: undefined,
        ex: undefined,
      },
      atributos: {
        fo: undefined,
        de: undefined,
        it: undefined,
        co: undefined,
      },
      competencias: {},
      memoriasCanonicas: undefined,
      marcasPessoais: undefined,
      inventario: undefined,
    } as never);

    expect(html).toContain('Capacidades físicas');
    expect(html).toContain('<div class="cell">-</div>');
    expect(html).toContain('Memórias canônicas');
  });

  it('should render magnitude when a malformed value is present', () => {
    const service = new CharacterSheetHtmlService();
    const html = service.createCharacterSheetHtml({
      ...createNewT13CharacterSheet(),
      atributos: {
        ...createNewT13CharacterSheet().atributos,
        fo: {
          base: null,
          atual: null,
          comCm: undefined,
        },
      },
    } as never);

    expect(html).toContain('<div class="cell">-</div>');
  });
});
