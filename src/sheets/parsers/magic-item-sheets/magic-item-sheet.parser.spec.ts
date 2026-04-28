import { BadRequestException } from '@nestjs/common';
import { MagicItemSheetParser } from './magic-item-sheet.parser';

describe('MagicItemSheetParser', () => {
  const parser = new MagicItemSheetParser();
  const descriptionFields = {
    descricaoAlma:
      'A alma do item parece uma pequena fênix adormecida dentro da lâmina, aquecendo a mão do portador sem queimar.',
    poderPrincipal:
      'Ao gastar 2 PF, a lâmina acende por 3 rodadas. Durante esse tempo, causa +1 de dano de fogo e ilumina uma área pequena.',
    instabilidadesRiscos:
      'Se a sintonia cair para -2, a lâmina solta faíscas inquietas e pode revelar a posição do portador em locais escuros.',
    efeitosPassivos:
      'Sempre morna ao toque. Concede +1 em testes para resistir a frio natural enquanto estiver sendo carregada.',
    historico:
      'Forjada por uma artesã de ANGEA durante uma vigília de inverno, esta lâmina foi criada para proteger viajantes perdidos. Seu primeiro dono a usou para guiar crianças por uma estrada tomada por névoa e lobos famintos.',
  };

  describe('parse', () => {
    it('should parse the magic item sheet from extracted PDF text', () => {
      const result = parser.parse(`
        Ficha de Item Mágico
        ANGEA                                 Nome  do item
        Data de Criação:28/04/2026

        Lâmina do Braseiro Sereno

        Categoria de Poder
        Fogo / Natureza - Relíquia Menor
        12 / 12 +1
        Estável
        Situação Atual
        Protetora e curiosa
        1,8 kg Aço negro e âmbar 2d6 corte + 1 fogo Corpo a corpo
        ${descriptionFields.descricaoAlma}
        ${descriptionFields.poderPrincipal}
        ${descriptionFields.instabilidadesRiscos}
        ${descriptionFields.efeitosPassivos}
        Histórico ${descriptionFields.historico}
      `);

      expect(result).toEqual({
        nome: 'Lâmina do Braseiro Sereno',
        dataCriacao: '28/04/2026',
        categoriaPoder: 'Fogo / Natureza - Relíquia Menor',
        situacaoAtual: 'Estável',
        pontosFadiga: {
          maximos: 12,
          atuais: 12,
        },
        nivelSintonia: 1,
        tracoConsciencia: 'Protetora e curiosa',
        peso: '1,8 kg',
        material: 'Aço negro e âmbar',
        dano: '2d6 corte + 1 fogo',
        alcance: 'Corpo a corpo',
        ...descriptionFields,
      });
    });

    it('should parse the sheet from pdf-parse extracted text', () => {
      const result = parser.parse(`
        Nome do item
        Ficha de Item Mágico
        Pontos de Fadiga / Atuais
        Data de Criação:
        ANGEA
        Categoria de Poder
        Poder Principal
        Nível de Sintonia (-3/+3)
        Instabilidades e Riscos
        Efeitos Passivos
        Traço de Consciência
        Descrição da Alma
        Peso Material Dano (tipo / valor) Alcance
        0 + Situação Atual
        Lâmina do Braseiro Sereno
        28/04/2026
        Fogo / Natureza - Relíquia Menor
        12 / 12 +1
        Estável
        Protetora e curiosa
        1,8 kg Aço negro e âmbar 2d6 corte + 1 fogo Corpo a corpo
        A alma do item parece uma pequena fênix adormecida dentro da lâmina, aquecendo a mão do portador sem queimar.
        Ao gastar 2 PF, a lâmina acende por 3 rodadas. Durante esse tempo, causa +1 de dano de fogo e ilumina uma área pequena.
        Se a sintonia cair para -2, a lâmina solta faíscas inquietas e pode revelar a posição do portador em locais escuros.
        Sempre morna ao toque. Concede +1 em testes para resistir a frio natural enquanto estiver sendo carregada.
        BRASA

        -- 1 of 2 --

        Ficha de Item Mágico
        ANGEA
        Histórico	Forjada por uma artesã de ANGEA durante uma vigília de inverno, esta lâmina foi criada para proteger viajantes perdidos.
        Seu primeiro dono a usou para guiar crianças por uma estrada tomada por névoa e lobos famintos.
        Depois da viagem, a arma passou a emitir um brilho calmo sempre que alguém indefeso está próximo.
        A consciência dentro dela não fala em voz alta, mas transmite sensações de calor, alerta e acolhimento.
        Quando aceita um novo portador, uma pequena chama azul aparece por um instante no fio.

        -- 2 of 2 --
      `);

      expect(result).toEqual({
        nome: 'Lâmina do Braseiro Sereno',
        dataCriacao: '28/04/2026',
        categoriaPoder: 'Fogo / Natureza - Relíquia Menor',
        situacaoAtual: 'Estável',
        pontosFadiga: {
          maximos: 12,
          atuais: 12,
        },
        nivelSintonia: 1,
        tracoConsciencia: 'Protetora e curiosa',
        peso: '1,8 kg',
        material: 'Aço negro e âmbar',
        dano: '2d6 corte + 1 fogo',
        alcance: 'Corpo a corpo',
        descricaoAlma:
          'A alma do item parece uma pequena fênix adormecida dentro da lâmina, aquecendo a mão do portador sem queimar.',
        poderPrincipal:
          'Ao gastar 2 PF, a lâmina acende por 3 rodadas. Durante esse tempo, causa +1 de dano de fogo e ilumina uma área pequena.',
        instabilidadesRiscos:
          'Se a sintonia cair para -2, a lâmina solta faíscas inquietas e pode revelar a posição do portador em locais escuros.',
        efeitosPassivos:
          'Sempre morna ao toque. Concede +1 em testes para resistir a frio natural enquanto estiver sendo carregada.',
        historico:
          'Forjada por uma artesã de ANGEA durante uma vigília de inverno, esta lâmina foi criada para proteger viajantes perdidos. Seu primeiro dono a usou para guiar crianças por uma estrada tomada por névoa e lobos famintos. Depois da viagem, a arma passou a emitir um brilho calmo sempre que alguém indefeso está próximo. A consciência dentro dela não fala em voz alta, mas transmite sensações de calor, alerta e acolhimento. Quando aceita um novo portador, uma pequena chama azul aparece por um instante no fio.',
      });
    });

    it('should normalize spacing in parsed text fields', () => {
      const result = parser.parse(`
        Nome do item
        Lâmina   do   Braseiro Sereno
        Data de Criação: 28/04/2026
        Categoria de Poder
        Fogo   / Natureza   -   Relíquia Menor
        12 / 12 +1
        Estável
        Situação Atual
        Protetora   e   curiosa
        1,8 kg Aço negro e âmbar 2d6 corte + 1 fogo Corpo a corpo
        ${descriptionFields.descricaoAlma}
        ${descriptionFields.poderPrincipal}
        ${descriptionFields.instabilidadesRiscos}
        ${descriptionFields.efeitosPassivos}
        Histórico ${descriptionFields.historico}
      `);

      expect(result.nome).toBe('Lâmina do Braseiro Sereno');
      expect(result.categoriaPoder).toBe('Fogo / Natureza - Relíquia Menor');
      expect(result.tracoConsciencia).toBe('Protetora e curiosa');
    });

    it('should parse fatigue points, attunement and physical attributes', () => {
      const result = parser.parse(`
        Nome do item
        Lâmina do Braseiro Sereno
        Data de Criação: 28/04/2026
        Categoria de Poder
        Fogo / Natureza - Relíquia Menor
        12 / 12 +1
        Estável
        Situação Atual
        Protetora e curiosa
        1,8 kg Aço negro e âmbar 2d6 corte + 1 fogo Corpo a corpo
        ${descriptionFields.descricaoAlma}
        ${descriptionFields.poderPrincipal}
        ${descriptionFields.instabilidadesRiscos}
        ${descriptionFields.efeitosPassivos}
        Histórico ${descriptionFields.historico}
      `);

      expect(result.pontosFadiga).toEqual({
        maximos: 12,
        atuais: 12,
      });
      expect(result.nivelSintonia).toBe(1);
      expect(result.peso).toBe('1,8 kg');
      expect(result.material).toBe('Aço negro e âmbar');
      expect(result.dano).toBe('2d6 corte + 1 fogo');
      expect(result.alcance).toBe('Corpo a corpo');
    });

    it('should parse description fields and history', () => {
      const result = parser.parse(`
        Nome do item
        Lâmina do Braseiro Sereno
        Data de Criação: 28/04/2026
        Categoria de Poder
        Fogo / Natureza - Relíquia Menor
        12 / 12 +1
        Estável
        Situação Atual
        Protetora e curiosa
        1,8 kg Aço negro e âmbar 2d6 corte + 1 fogo Corpo a corpo
        ${descriptionFields.descricaoAlma}
        ${descriptionFields.poderPrincipal}
        ${descriptionFields.instabilidadesRiscos}
        ${descriptionFields.efeitosPassivos}
        Histórico ${descriptionFields.historico}
      `);

      expect(result.descricaoAlma).toBe(descriptionFields.descricaoAlma);
      expect(result.poderPrincipal).toBe(descriptionFields.poderPrincipal);
      expect(result.instabilidadesRiscos).toBe(
        descriptionFields.instabilidadesRiscos,
      );
      expect(result.efeitosPassivos).toBe(descriptionFields.efeitosPassivos);
      expect(result.historico).toBe(descriptionFields.historico);
    });

    it('should reject text without the required header fields', () => {
      expect(() => parser.parse('Ficha de Item Mágico')).toThrow(
        BadRequestException,
      );
    });
  });
});
